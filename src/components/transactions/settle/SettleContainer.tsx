/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { useCallback } from 'react';
import { jsx, Text, Button, ThemeUIStyleObject } from 'theme-ui';
import { useRouter } from 'next/router';

import Link from 'components/links/Link';
import TransactionAwaitingConfirmation from 'components/transactions/TransactionAwaitingConfirmation';
import TransactionContent from '../TransactionContent';

import { MethodEnum } from 'types/NFTMarketInterface';
import { ModalKey } from 'types/modal';
import Auction from 'types/Auction';
import Artwork from 'types/Artwork';

import {
  isArtworkAuctionWinner,
  isArtworkAuctionCreator,
  isAuctionStatusOpen,
  isArtworkAuctionOwner,
} from 'utils/auctions/auctions';
import { isValidTxHash } from 'utils/helpers';

import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useNextRoute from 'hooks/use-next-route';
import useModal from 'hooks/use-modal';

import { transactionButton } from '../styles';

interface SettleContainerProps {
  auction: Auction;
  artwork: Artwork;
  publicAddress: string;
}

export default function SettleContainer(
  props: SettleContainerProps
): JSX.Element {
  const { publicAddress, auction, artwork } = props;

  const router = useRouter();

  const { setCurrentModal } = useModal();

  const sx = getStyles();

  console.log({ auction });
  const isAuctionWinner = isArtworkAuctionWinner(publicAddress, auction);
  const isAuctionCreator = isArtworkAuctionCreator(publicAddress, artwork);
  const isAuctionOwner = isArtworkAuctionOwner(publicAddress, auction);
  const isAuctionOpen = isAuctionStatusOpen(auction);

  const submittedRoute = useNextRoute('/settle/submitted');

  const {
    sendClaimTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
  } = useNFTTransaction({
    method: MethodEnum.Settle,
  });

  const handleSubmit = useCallback(async () => {
    if (isProviderLoading) {
      return setCurrentModal(ModalKey.AUTH_MAIN);
    }

    const txHash = await sendClaimTransaction({ auctionId: auction.auctionId });

    const hasValidTxHash = isValidTxHash(txHash);

    if (hasValidTxHash) {
      await router.push({
        pathname: submittedRoute,
        query: { txHash },
      });
    }
  }, [
    router,
    submittedRoute,
    auction,
    sendClaimTransaction,
    isProviderLoading,
    setCurrentModal,
  ]);

  // TODO: add fallback state for when auction can’t be settled
  if (!isAuctionOpen) {
    return (
      <TransactionContent
        title="Auction settled"
        description="The auction for this NFT has already been settled."
      >
        <Link href="/">
          <a sx={{ display: 'block', textDecoration: 'none' }}>
            <Button sx={transactionButton}>Back home</Button>
          </a>
        </Link>
      </TransactionContent>
    );
  }

  if (isLoading || isSuccess) {
    return <TransactionAwaitingConfirmation />;
  }

  if (isAuctionWinner) {
    return (
      <TransactionContent
        title="Settle auction"
        description="Congratulations, you won the auction for this NFT. Settle the auction to add it to your collection."
      >
        <Button sx={transactionButton} onClick={handleSubmit}>
          Settle
        </Button>
        <Text variant="body.body" sx={sx.subtext}>
          Settling the auction will release funds from escrow to the original
          owner.
        </Text>
      </TransactionContent>
    );
  }

  if (isAuctionCreator || isAuctionOwner) {
    return (
      <TransactionContent
        title="Settle auction"
        description="The auction for your NFT has ended, and you can now claim the ETH from the sale."
      >
        <Button sx={transactionButton} onClick={handleSubmit}>
          Settle
        </Button>
        <Text variant="body.body" sx={sx.subtext}>
          Settling the auction will release the NFT from escrow, transferring it
          to the collector.
        </Text>
      </TransactionContent>
    );
  }

  return null;
}

const getStyles = () => {
  const heading: ThemeUIStyleObject = {};
  const text: ThemeUIStyleObject = {};

  const subtext: ThemeUIStyleObject = {
    color: 'black.50',
  };

  return { heading, text, subtext };
};

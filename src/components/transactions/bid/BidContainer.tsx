/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Grid, Box, Flex } from 'theme-ui';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import TransactionForm from 'components/forms/transactions/TransactionForm';
import BidSubmitButton from 'components/transactions/bid/BidSubmitButton';
import BidAmountInUSD from 'components/transactions/bid/BidAmountInUSD';
import ETHField from 'components/forms/fields/ETHField';
import ETHBalance from 'components/ETHBalance';
import BidStartNotice from './BidStartNotice';
import DisabledButton from 'components/forms/transactions/DisabledButton';
import BidNotice from './BidNotice';
import TransactionAwaitingConfirmation from 'components/transactions/TransactionAwaitingConfirmation';
import TransactionNoVerification from '../TransactionNoVerification';
import MinBidAmount from '../artwork/MinBidAmount';
import { TransactionError } from '../TransactionError';

import useNextRoute from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import {
  getAuctionMinBidPrice,
  isAuctionOpenForBids,
} from 'utils/auctions/auctions';
import { formatETHWithSuffix } from 'utils/formatters';
import { isNonUserRejectedError } from 'utils/transactions';
import { isValidTxHash, notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';

import { createBidAmountSchema } from 'schemas/transaction';

import { mobileAlignCenter, mobileText } from 'components/transactions/styles';
import { ModalKey } from 'types/modal';
import { MethodEnum } from 'types/NFTMarketInterface';
import SocialVerification from 'types/SocialVerification';
import WalletUser from 'types/WalletUser';
import Artwork from 'types/Artwork';

interface BidContainerProps {
  artwork: Artwork;
  balance: number;
  socialVerifications: SocialVerification[];
  auctionId: string;
  user: WalletUser;
  resetTransaction: () => void;
}

export default function BidContainer(props: BidContainerProps): JSX.Element {
  const {
    artwork,
    balance,
    socialVerifications,
    auctionId,
    user,
    resetTransaction,
  } = props;

  const router = useRouter();

  const { setCurrentModal } = useModal();

  const [txHash, setTxHash] = useState<string>(null);

  const hasValidVerification = notEmptyOrNil(socialVerifications);

  const mostRecentActiveAuction = artwork?.mostRecentActiveAuction;
  const auctionBids = mostRecentActiveAuction?.bids ?? [];
  const publicAddress = user?.publicAddress;

  const hasBids = notEmptyOrNil(auctionBids);
  const minBidAmount = getAuctionMinBidPrice(mostRecentActiveAuction);
  const isOpenForBids = isAuctionOpenForBids(mostRecentActiveAuction);

  const isOwnedByCurrentUser = areKeysEqual([
    publicAddress,
    // owner’s address
    artwork?.ownedOrListedBy?.id,
  ]);

  const isHighestBidder = areKeysEqual([
    publicAddress,
    // highest bidder’s address (which may not exist)
    mostRecentActiveAuction?.highestBid?.bidder?.id,
  ]);

  const submittedRoute = useNextRoute('/bid/submitted');

  const {
    sendBidTransaction,
    isLoading,
    isError,
    error,
    isProviderLoading,
  } = useNFTTransaction({
    method: MethodEnum.Bid,
  });

  const handleSubmit = useCallback(
    async (values) => {
      if (isProviderLoading) {
        return setCurrentModal(ModalKey.AUTH_MAIN);
      }

      const amountString: string = values.amount;
      const txPayload = {
        price: amountString,
        auctionId,
      };

      const txHash = await sendBidTransaction(txPayload);

      const hasValidTxHash = isValidTxHash(txHash);

      if (hasValidTxHash) {
        setTxHash(txHash);

        await router.push({
          pathname: submittedRoute,
          query: { txHash },
        });
      }
    },
    [
      router,
      submittedRoute,
      auctionId,
      sendBidTransaction,
      isProviderLoading,
      setCurrentModal,
    ]
  );

  if (!hasValidVerification) {
    return <TransactionNoVerification />;
  }

  // Keep showing loading state up until we redirect
  if (isLoading || txHash) {
    return <TransactionAwaitingConfirmation />;
  }

  if (isError && isNonUserRejectedError(error)) {
    return (
      <TransactionError error={error} resetTransaction={resetTransaction} />
    );
  }

  return (
    <Grid gap="s">
      <Heading variant="h.l" sx={{ ...mobileAlignCenter, ...mobileText }}>
        Place a bid
      </Heading>

      <TransactionForm
        amount=""
        onSubmit={handleSubmit}
        schema={createBidAmountSchema({
          min: minBidAmount,
          max: balance,
        })}
      >
        <Grid gap="m">
          <Grid gap={10}>
            <Grid gap="m">
              <MinBidAmount minBidAmount={minBidAmount} sx={mobileText} />
              <ETHField
                name="amount"
                placeholder="0"
                //eslint-disable-next-line
                autoFocus
              />
            </Grid>

            <Flex>
              <BidAmountInUSD name="amount" />
            </Flex>
          </Grid>

          <Grid gap={['m', null, 'l']}>
            <ETHBalance balance={balance} formatter={formatETHWithSuffix} />

            <Box
              sx={{
                ...mobileText,
                maxWidth: [320],
                marginX: ['auto', null, 0],
              }}
            >
              {hasBids ? <BidNotice /> : <BidStartNotice />}
            </Box>

            <Box sx={{ maxWidth: [null, null, 320], width: '100%' }}>
              {isOwnedByCurrentUser ? (
                <DisabledButton>
                  You’re the owner of this artwork
                </DisabledButton>
              ) : isHighestBidder ? (
                <DisabledButton>You’re the highest bidder</DisabledButton>
              ) : isOpenForBids ? (
                <BidSubmitButton name="amount">Place bid</BidSubmitButton>
              ) : (
                <DisabledButton>This artwork isn’t listed yet</DisabledButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </TransactionForm>
    </Grid>
  );
}

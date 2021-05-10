/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex } from 'theme-ui';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { any } from 'ramda';
import { BigNumber } from '@ethersproject/bignumber';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import { useSubgraphArtworkByTokenId } from 'hooks/queries/subgraph/use-artwork-by-token-id';
import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';

import MetaMaskError from 'components/auth/MetaMaskError';
import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import SettleCreatorAction from 'components/transactions/settle/SettleCreatorAction';
import SettleCollectorAction from 'components/transactions/settle/SettleCollectorAction';
import TransactionContent from 'components/transactions/TransactionContent';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import ConfettiCanvas from 'components/ConfettiCanvas';
import TransactionPendingState from 'components/transactions/TransactionPendingState';

import { getNFTMarketContractToRead } from 'lib/contracts';
import { CREATOR_FEE_MULTIPLIER } from 'lib/constants';

import { getFirstValue, getUsernameOrAddress } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import { isArtworkAuctionWinner } from 'utils/auctions/auctions';
import { formatETHWithSuffix } from 'utils/formatters';
import { buildClaimTweet, getTwitterUsername } from 'utils/twitter-templates';

import Artwork from 'types/Artwork';
import { mobileAlignCenter } from 'components/transactions/styles';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import { areKeysEqual } from 'utils/users';
import useArtworkSplits from 'hooks/queries/subgraph/use-artwork-splits';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';

SettleAuction.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Auction settled',
});

export default function SettleAuction(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const { data: userData, isLoading: userLoading } = useUserByPublicKey({
    publicKey: publicAddress,
    refetchOnWindowFocus: false,
  });

  const [isEventEmitted, setIsEventEmitted] = useState<boolean>(false);

  const router = useRouter();

  const artworkSlug: string = getFirstValue(router.query.slug);
  const tokenId: string = getTokenId(artworkSlug);
  const txHash = getFirstValue(router.query.txHash);

  const { data: subgraphArtworkData, loading: isSubgraphArtworkLoading } =
    useSubgraphArtworkByTokenId(tokenId);

  const { data: artworkData, loading: serverArtworkLoading } =
    useHasuraArtworkByTokenId({ tokenId });

  const { data: socialVerificationsData } = useSocialVerifications({
    publicKey: artworkData?.artwork?.creator?.publicKey,
  });

  const { data: artworkSplitsData, isLoading: artworkSplitsLoading } =
    useArtworkSplits({ tokenId });

  const { isWrongNetwork } = useIsWrongNetwork();

  const loadingStates = [
    isUserLoading,
    !user,
    userLoading,
    isSubgraphArtworkLoading,
    serverArtworkLoading,
    artworkSplitsLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  const { provider } = useReadOnlyProvider();

  const nftMarket = getNFTMarketContractToRead(provider);

  const firstNft: Artwork = getFirstValue(subgraphArtworkData?.artworks);

  const shares = artworkSplitsData?.shares;

  const shareForThisUser = shares?.find((share) =>
    areKeysEqual([share?.account?.id, publicAddress])
  );

  const percentSplitForThisUser = shareForThisUser?.shareInPercent;

  const mostRecentActiveAuction = firstNft?.mostRecentActiveAuction;
  const auctionId = mostRecentActiveAuction?.auctionId;

  const isAuctionCollector = isArtworkAuctionWinner(
    publicAddress,
    mostRecentActiveAuction
  );

  const artwork = artworkData?.artwork;
  const artworkCreator = artwork?.creator;
  const artworkCreatorName = artworkCreator?.name ?? artworkCreator?.username;

  const twitterShareText = buildClaimTweet({
    artworkName: artwork?.name,
    creatorName: artworkCreatorName,
    usernameOrAddress: getUsernameOrAddress(userData?.user),
    twitterUsername: getTwitterUsername(socialVerificationsData),
  });

  useEffect(() => {
    if (nftMarket && auctionId) {
      nftMarket.once(
        nftMarket.filters.ReserveAuctionFinalized(
          BigNumber.from(auctionId),
          null,
          null,
          null,
          null,
          null
        ),
        (auctionId, seller, bidder, f8nFee, creatorFee, ownerRev, tx) => {
          // console.log(`Finalized ${auctionId} in ${tx?.transactionHash}`);
          setIsEventEmitted(true);
        }
      );
    }
  }, [nftMarket, auctionId]);

  if (isWrongNetwork) {
    return <MetaMaskError />;
  }

  const isLoadingState = !isEventEmitted || isLoading;

  // when loading and in the collector context
  if (isLoadingState) {
    return (
      <TransactionContent
        title="This auction is being settled."
        description="This auction is being settled on the Ethereum blockchain. You’re free to leave this page if you like."
      >
        <TransactionPendingState txHash={txHash} />
      </TransactionContent>
    );
  }

  // success in the collector context
  if (isAuctionCollector) {
    return (
      <>
        <ConfettiCanvas fireConfetti={isEventEmitted} />
        <TransactionContent
          title="This NFT is now in your collection!"
          description="This auction has been successfully settled on the Ethereum blockchain, and the NFT is now in your collection."
        >
          <SettleCollectorAction
            twitterShareText={twitterShareText}
            user={userData?.user}
          />
          <Flex sx={mobileAlignCenter}>
            <TransactionHashLink txHash={txHash} />
          </Flex>
        </TransactionContent>
      </>
    );
  }

  const winningBid = Number(mostRecentActiveAuction?.highestBid?.amountInETH);

  const amountPaid = percentSplitForThisUser
    ? formatETHWithSuffix(
        (winningBid *
          CREATOR_FEE_MULTIPLIER *
          Number(percentSplitForThisUser)) /
          100
      )
    : formatETHWithSuffix(winningBid * CREATOR_FEE_MULTIPLIER);

  const creatorSuccessCopy = percentSplitForThisUser
    ? `This auction has been successfully settled on the Ethereum blockchain, and your share of ${percentSplitForThisUser}% has been sent to your wallet.`
    : `This auction has been successfully settled on the Ethereum blockchain, and the ETH has been sent to your wallet.`;

  // success in the creator context
  return (
    <>
      <ConfettiCanvas fireConfetti={isEventEmitted} />
      <TransactionContent
        title={
          <Grid gap="s">
            You just got paid!
            <br />
            <span sx={{ color: 'green.utility' }}>+{amountPaid}</span>
          </Grid>
        }
        description={creatorSuccessCopy}
      >
        <SettleCreatorAction user={userData?.user} />
      </TransactionContent>
    </>
  );
}

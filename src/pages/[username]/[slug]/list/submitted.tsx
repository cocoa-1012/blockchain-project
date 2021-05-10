/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
// // Note: This list is for secondary sales
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';

import SecondaryListTransactionSuccess from 'components/transactions/secondaryList/SecondaryListTransactionSuccess';
// Note: Identical to the component for primary lists, so using that one here
import ListTransactionListing from 'components/transactions/list/ListTransactionListing';
import { WrappedTransactionLayout } from 'components/layouts/TransactionLayout';

import useArtworkByTokenId from 'hooks/queries/use-artwork-by-token-id';
import useSubgraphArtworkByTokenIdWithPolling from 'hooks/queries/subgraph/use-artwork-by-token-id';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';

import { getFirstValue, isAnyTrue } from 'utils/helpers';
import { buildArtworkPath } from 'utils/artwork/artwork';
import { getTokenId } from 'utils/products';
import { getTwitterUsername } from 'utils/twitter-templates';

import { NftMarketAuctionStatus } from '@f8n/f8n-contracts/src/types/generated/subgraph';

SecondaryListSubmitted.getLayout = WrappedTransactionLayout({
  title: 'List',
});

// TODO: Switch to this new layout, time-permitting
// SecondaryListSubmitted.getLayout = WrappedTransactionLayoutWithCard({
//   title: 'List',
//   enableNavigation: false,
// });

export default function SecondaryListSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const router = useRouter();

  const artworkSlug = getFirstValue(router.query.slug);
  const txHash = getFirstValue(router.query.txHash);

  const tokenId = getTokenId(artworkSlug);

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByTokenId({ tokenId });

  const { data: subgraphArtworkData, loading: isSubgraphArtworkLoading } =
    useSubgraphArtworkByTokenIdWithPolling(tokenId);

  const { data: socialVerificationData } = useSocialVerifications({
    publicKey: artworkData?.creator?.publicKey,
  });

  const nfts = subgraphArtworkData?.artworks;
  const firstNft = nfts ? nfts[0] : null;

  const mostRecentActiveAuction = firstNft?.mostRecentActiveAuction;
  const auctionStatus = mostRecentActiveAuction?.status;

  // Note: For secondary listings, having a most recent auction
  // isn't enough of a check. We need to confirm that the most recent auction
  // is the one we just tried to create
  // TODO: Make this check more specific
  const isListedOnSubgraph = auctionStatus === NftMarketAuctionStatus.Open;

  const status = artworkData?.status;

  const artworkPath = buildArtworkPath({
    artwork: artworkData,
    user: artworkData?.creator,
  });

  const isLoading = isAnyTrue([
    !isListedOnSubgraph,
    isArtworkLoading,
    isSubgraphArtworkLoading,
  ]);

  if (isLoading) {
    return <ListTransactionListing artwork={artworkData} txHash={txHash} />;
  }

  return (
    <SecondaryListTransactionSuccess
      artwork={artworkData}
      txHash={txHash}
      status={status}
      artworkPath={artworkPath}
      isListedOnSubgraph={isListedOnSubgraph}
      twitterUsername={getTwitterUsername(socialVerificationData)}
    />
  );
}

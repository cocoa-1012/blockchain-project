/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';

import { WrappedTransactionLayout } from 'components/layouts/TransactionLayout';
import ListTransactionSuccess from 'components/transactions/list/ListTransactionSuccess';
import ListTransactionListing from 'components/transactions/list/ListTransactionListing';

import useArtworkByTokenId from 'hooks/queries/use-artwork-by-token-id';

import { getFirstValue, isAnyTrue } from 'utils/helpers';
import { buildArtworkPath } from 'utils/artwork/artwork';
import { getTokenId } from 'utils/products';

import { POLL_INTERVAL_VIDEO } from 'lib/constants';
import { creatorFlowSteps } from 'components/transactions/navigationFlows';

ListSubmitted.getLayout = WrappedTransactionLayout({
  title: 'List',
  percentCompleted: 100,
  navigationSteps: creatorFlowSteps,
});

export default function ListSubmitted(): JSX.Element {
  const router = useRouter();

  const artworkSlug = getFirstValue(router.query.slug);
  const txHash = getFirstValue(router.query.txHash);

  const tokenId = getTokenId(artworkSlug);

  const { data: artworkData, isLoading: artworkLoading } = useArtworkByTokenId({
    tokenId,
    refetchInterval: POLL_INTERVAL_VIDEO,
  });

  const isListedOnSubgraph = Boolean(artworkData?.mostRecentActiveAuction);

  const status = artworkData?.status;

  const artworkPath = buildArtworkPath({
    artwork: artworkData,
    user: artworkData?.creator,
  });

  const isLoading = isAnyTrue([!isListedOnSubgraph, artworkLoading]);

  if (isLoading) {
    return <ListTransactionListing artwork={artworkData} txHash={txHash} />;
  }

  return (
    <ListTransactionSuccess
      artwork={artworkData}
      txHash={txHash}
      status={status}
      artworkPath={artworkPath}
      isListedOnSubgraph={isListedOnSubgraph}
    />
  );
}

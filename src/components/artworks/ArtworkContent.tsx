/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Heading } from 'theme-ui';

import Account from 'types/Account';

import { getArtworkHistory } from 'utils/history';

import useArtworkHistory from 'hooks/queries/subgraph/use-artwork-history';

import ArtworkHistory, { ArtworkHistorySkeleton } from './ArtworkHistory';
import ArtworkAuctionState from './auction/ArtworkAuctionState';
import GraySquare from 'components/GraySquare';

interface ArtworkContentProps {
  creator: Account;
  tokenId: string;
  publicAddress: string;
}

export default function ArtworkContent(
  props: ArtworkContentProps
): JSX.Element {
  const { creator, tokenId, publicAddress } = props;

  const { data: artworkData, isLoading: isArtworkLoading } = useArtworkHistory({
    tokenId,
    refetchInterval: 10000,
  });

  if (isArtworkLoading) {
    return <BidRowSkeletonBlock />;
  }

  const artwork = artworkData?.nft;

  if (!artwork) {
    return null;
  }

  const artworkHistory = getArtworkHistory(artwork);

  const mostRecentActiveAuction = artwork?.mostRecentActiveAuction;

  // TODO: Consider showing bid history even if there's no user yet
  // because that doesn't depend on the current user like the auction state
  // section does
  return (
    <Grid gap="l" sx={{ position: 'relative', zIndex: 5, flex: 1 }}>
      <ArtworkAuctionState
        auction={mostRecentActiveAuction}
        artworkHistory={artworkHistory}
        creator={creator}
        artwork={artwork}
        publicAddress={publicAddress}
      />
      <ArtworkHistory history={artworkHistory} />
    </Grid>
  );
}

interface BidRowSkeletonProps {
  height: number;
  width?: number | string;
  className?: string;
  backgroundColor?: string;
}

function BidRowSkeleton(props: BidRowSkeletonProps) {
  const {
    className,
    height,
    width = '100%',
    backgroundColor = 'black.5',
  } = props;
  return (
    <GraySquare
      className={className}
      width={width}
      height={height}
      sx={{ borderRadius: 10, backgroundColor: backgroundColor }}
    />
  );
}

interface BidRowSkeletonBlockProps {
  backgroundColor?: string;
}

function BidRowSkeletonBlock(props: BidRowSkeletonBlockProps) {
  const { backgroundColor = 'black.5' } = props;

  if (backgroundColor === 'black.5') {
    return (
      <Grid gap="l" sx={{ position: 'relative', zIndex: 5, flex: 1 }}>
        <Grid>
          <BidRowSkeleton height={164} />
        </Grid>

        <Grid gap="m">
          <Heading variant="h.s">Activity</Heading>
          <ArtworkHistorySkeleton />
        </Grid>
      </Grid>
    );
  }

  // TODO: DRY This up more with the above skeleton without a custom color
  return (
    <Grid gap="l" sx={{ position: 'relative', zIndex: 5, flex: 1 }}>
      <Grid>
        <BidRowSkeleton height={164} backgroundColor={backgroundColor} />
      </Grid>

      <Grid gap="s">
        <BidRowSkeleton
          height={32}
          width={128}
          backgroundColor={backgroundColor}
        />
        <Grid gap="s">
          <BidRowSkeleton height={76} backgroundColor={backgroundColor} />
          <BidRowSkeleton height={76} backgroundColor={backgroundColor} />
          <BidRowSkeleton height={76} backgroundColor={backgroundColor} />
        </Grid>
      </Grid>
    </Grid>
  );
}

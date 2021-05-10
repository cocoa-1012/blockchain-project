/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Flex } from 'theme-ui';
import { useState } from 'react';
import { useHarmonicIntervalFn } from 'react-use';

import UserTag from 'components/users/UserTag';
import FeaturedArtworkMedia from './FeaturedArtworkMedia';
import FeaturedArtworkPrice from './FeaturedArtworkPrice';
import Link from 'components/links/Link';
import FeatureArtworkTitle from './FeaturedArtworkTitle';
import FeaturedArtworkButtons from './FeaturedArtworkButtons';
import FollowPopover from 'components/follows/FollowPopover';

import Artwork from 'types/Artwork';
import { StyleObject } from 'types/styles';
import { ArtworkOrientation } from './types';

import { buildArtworkPath } from 'utils/artwork/artwork';
import { isAuctionOpenForBids } from 'utils/auctions/auctions';
import { getMinutesRemaining } from 'utils/dates/dates';

import useFeaturedArtwork from 'hooks/queries/subgraph/use-featured-artwork';

interface FeaturedArtwork {
  artwork: Artwork;
}

export default function FeaturedArtwork(props: FeaturedArtwork): JSX.Element {
  const { artwork } = props;

  const {
    data: artworkData,
    isError,
    isFetchedAfterMount,
  } = useFeaturedArtwork({ artwork });

  const artworkPath = buildArtworkPath({ artwork, user: artwork.creator });

  const artworkRatio = artwork.width / artwork.height;
  const artworkOrientation = getArtworkOrientation(artworkRatio);

  // get auction data from the query vs. static data
  const auction = artworkData?.mostRecentActiveAuction;
  const dateEnding = auction?.dateEnding;

  const isAuctionOpen = isAuctionOpenForBids(auction);

  const [minutesRemaining, setMinutesRemaining] = useState<number>(
    getMinutesRemaining(dateEnding)
  );

  useHarmonicIntervalFn(() => {
    const minutesRemaining = getMinutesRemaining(dateEnding);
    setMinutesRemaining(minutesRemaining);
  }, 1000);

  const sx = getStyles();

  // when the data is state (on initial load) and we have no error
  // then this is the equivalent of our loading state
  const isLoading = !isFetchedAfterMount && !isError;

  return (
    <Grid sx={sx.grid}>
      <Link href={artworkPath}>
        <a sx={sx.image}>
          <FeaturedArtworkMedia
            artwork={artwork}
            orientation={artworkOrientation}
          />
        </a>
      </Link>

      <Box sx={sx.info}>
        <Flex sx={{ paddingTop: ['m', null, 0] }}>
          <FollowPopover publicKey={artwork.creator.publicKey}>
            <UserTag user={artwork.creator} />
          </FollowPopover>
        </Flex>
        <Grid gap={['m', null, null, 'l']}>
          <FeatureArtworkTitle artwork={artwork} artworkPath={artworkPath} />

          <FeaturedArtworkPrice
            artwork={artworkData}
            auction={artworkData?.mostRecentActiveAuction}
            minutesRemaining={minutesRemaining}
            isLoading={isLoading}
          />

          <FeaturedArtworkButtons
            artworkPath={artworkPath}
            isAuctionOpen={isAuctionOpen}
            minutesRemaining={minutesRemaining}
            isLoading={isLoading}
          />
        </Grid>
      </Box>
    </Grid>
  );
}

const getArtworkOrientation = (artworkRatio: number): ArtworkOrientation => {
  return artworkRatio < 1
    ? ArtworkOrientation.Portrait
    : artworkRatio === 1
    ? ArtworkOrientation.Square
    : ArtworkOrientation.Landscape;
};

const getStyles = (): StyleObject => ({
  grid: {
    paddingTop: [null, null, 'xxl', 'xxxl'],
    gridTemplateColumns: [null, null, 'repeat(2,1fr)'],
    gap: [0, null, 'l', 'xl', 'xxxl'],
    alignItems: [null, null, 'center'],
    minHeight: 'calc(80vh - 86px)',
  },
  image: {
    maxWidth: [null, null, 640],
    marginLeft: [null, null, 'auto'],
    width: '100%',
    display: 'flex',
  },
  info: {
    paddingBottom: [null, null, null, 'm'],
  },
});

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, Grid } from 'theme-ui';
import { useQuery } from 'react-query';
import { memo } from 'react';
import { take } from 'ramda';

import Body from 'components/Body';
import CardGrid from 'components/CardGrid';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import Pulse from 'components/Pulse';

import { getGraphAndServerTrendingArtworks } from 'queries/artworks';

import Artwork from 'types/Artwork';
import { positionRelative, StyleObject } from 'types/styles';

import { isEmptyOrNil } from 'utils/helpers';

export default memo(TrendingAuctions);

interface TrendingAuctionsProps {
  artworkCount?: number;
}

function TrendingAuctions(props: TrendingAuctionsProps): JSX.Element {
  const { artworkCount = 8 } = props;

  const skeletonarray = new Array(artworkCount).fill(null);

  const sx = getStyles();

  const timeStampNow = Math.round(Date.now() / 1000);

  // react-query vs. apollo here as it does a better job of joining
  // between two data sources behind a single query
  const { data: artworksData, isLoading } = useQuery(
    'getGraphAndServerTrendingArtworks',
    () =>
      getGraphAndServerTrendingArtworks({
        limit: 48,
        now: timeStampNow,
      }),
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <Body sx={sx.body}>
        <FeaturedSectionHeading>Trending auctions</FeaturedSectionHeading>
        <CardGrid>
          {skeletonarray.map((_, key) => (
            <ArtworkCardSkeleton key={key} />
          ))}
        </CardGrid>
      </Body>
    );
  }

  const artworks = take(artworkCount, artworksData?.artworks ?? []);
  const noArtworks = isEmptyOrNil(artworks);

  if (noArtworks) {
    return null;
  }

  return (
    <Body sx={sx.body}>
      <FeaturedSectionHeading
        linkHref="/artworks?refinementList%5Bavailability%5D%5B0%5D=LIVE_AUCTION"
        linkText="View all auctions"
      >
        <Flex sx={{ alignItems: 'center' }}>
          <Pulse sx={{ position: 'relative', top: 2 }} />
          <Text sx={{ fontFamily: 'inherit', marginLeft: 14 }}>
            Trending auctions
          </Text>
        </Flex>
      </FeaturedSectionHeading>
      <Grid gap="l">
        <CardGrid>
          {artworks.map((artwork: Artwork) => (
            <ArtworkCard
              artwork={artwork}
              creator={artwork.creator}
              mostRecentActiveAuction={artwork.mostRecentActiveAuction}
              key={artwork.id}
            />
          ))}
        </CardGrid>
      </Grid>
    </Body>
  );
}

const getStyles = (): StyleObject => ({
  body: { position: positionRelative, zIndex: 4 },
});

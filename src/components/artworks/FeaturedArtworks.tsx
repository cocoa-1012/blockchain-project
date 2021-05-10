/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';

import Body from 'components/Body';
import CardGrid from 'components/CardGrid';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import HomePageButton from 'components/buttons/HomePageButton';

import { areKeysEqual } from 'utils/users';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import Artwork from 'types/Artwork';
import { positionRelative, StyleObject } from 'types/styles';

interface FeaturedArtworksProps {
  featuredArtworks: Artwork[];
  publicAddress: string;
}

export default function FeaturedArtworks(
  props: FeaturedArtworksProps
): JSX.Element {
  const { featuredArtworks, publicAddress } = props;

  const { data: currentUser } = useUserByPublicKey({
    publicKey: publicAddress,
    refetchOnWindowFocus: false,
  });

  if (!featuredArtworks) {
    return null;
  }

  const sx = getStyles();

  return (
    <Body sx={sx.body}>
      <FeaturedSectionHeading linkHref="/artworks" linkText="View all artworks">
        Featured artworks
      </FeaturedSectionHeading>
      <Grid gap="l">
        <CardGrid>
          {featuredArtworks.map((artwork: Artwork) => (
            <ArtworkCard
              artwork={artwork}
              creator={artwork.creator}
              mostRecentActiveAuction={artwork.mostRecentActiveAuction}
              isOwner={areKeysEqual([
                publicAddress,
                artwork.ownedOrListedBy.id,
              ])}
              user={currentUser?.user}
              key={artwork.id}
            />
          ))}
        </CardGrid>
        <HomePageButton href="/artworks">View all artworks</HomePageButton>
      </Grid>
    </Body>
  );
}

const getStyles = (): StyleObject => ({
  body: { position: positionRelative, zIndex: 4 },
});

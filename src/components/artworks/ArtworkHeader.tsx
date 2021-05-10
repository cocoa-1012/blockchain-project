/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { forwardRef } from 'react';

import ScrollToContent from 'components/ScrollToContent';
import ArtworkTitle, {
  ArtworkTitleSkeleton,
} from 'components/artworks/ArtworkTitle';

import { BasicArtwork } from 'types/Artwork';
import { positionRelative } from 'types/styles';

interface ArtworkHeaderProps {
  artwork: BasicArtwork;
}

const ArtworkHeader = forwardRef<HTMLDivElement, ArtworkHeaderProps>(
  (props, ref) => {
    const { artwork } = props;
    const sx = artworkHeaderStyles();

    return (
      <Box sx={sx.container} ref={ref}>
        <Box sx={sx.metaContainer}>
          <Box sx={{ flex: 3 }}>
            {artwork?.name ? (
              <ArtworkTitle name={artwork.name} />
            ) : (
              <ArtworkTitleSkeleton />
            )}
          </Box>
        </Box>
        <Box sx={sx.scroll}>
          <ScrollToContent text="Artwork information" />
        </Box>
      </Box>
    );
  }
);

const artworkHeaderStyles = () => ({
  container: {
    backgroundColor: 'white.100',
    position: positionRelative,
    zIndex: 2,
    pb: ['s', 'l'],
  },
  metaContainer: {
    display: ['block', null, null, 'flex'],
    alignItems: 'flex-end',
  },
  meta: {
    mr: [null, 'm', null, '0'],
    flex: [null, 1, null, 'inherit'],
  },

  scroll: {
    mt: 'xs',
    display: ['none', null, null, 'flex'],
  },
});

export default ArtworkHeader;

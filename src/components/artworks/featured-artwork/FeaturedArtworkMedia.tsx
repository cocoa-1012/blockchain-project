/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';
import { css } from 'stitches.config';

import { MediaVideo } from 'components/media/Media';
import Model from 'components/model-media/Model';

import Artwork from 'types/Artwork';
import { ArtworkOrientation } from './types';
import {
  pointerEventsNone,
  positionAbsolute,
  positionRelative,
} from 'types/styles';

import ThreeDIcon from 'assets/icons/3d-icon.svg';

import {
  buildArtworkPageAssetUrl,
  buildPosterUrl,
  isModel,
  isVideo,
} from 'utils/assets';

interface FeaturedArtworkMediaProps {
  artwork: Artwork;
  orientation: ArtworkOrientation;
}

const modelStyles = css({
  width: '100%',
})();

export default function FeaturedArtworkMedia(
  props: FeaturedArtworkMediaProps
): JSX.Element {
  const { artwork, orientation } = props;

  const assetUrl = buildArtworkPageAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const isVideoUrl = isVideo(assetUrl);
  const isModelUrl = isModel(assetUrl);

  const maxHeights = {
    [ArtworkOrientation.Landscape]: [null, null, 400],
    [ArtworkOrientation.Portrait]: [null, null, '60vh'],
  };

  const maxWidths = {
    [ArtworkOrientation.Square]: [null, null, 500],
  };

  if (isVideoUrl) {
    return (
      <MediaVideo
        assetUrl={assetUrl}
        posterUrl={posterUrl}
        sx={{
          maxHeight: maxHeights[orientation] ?? 'none',
          maxWidth: maxWidths[orientation] ?? '100%',
          margin: 'auto',
        }}
      />
    );
  }

  if (isModelUrl) {
    return (
      <Box sx={modelViewStyles.model}>
        <Model src={assetUrl} className={modelStyles.className} disableAR />

        <Box sx={modelViewStyles.threeDIcon}>
          <Box sx={{ width: 20 }}>
            <ThreeDIcon />
          </Box>
          <Text variant="h.xs" sx={{ ml: 'xxs' }}>
            3D
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <img
      src={assetUrl}
      alt={artwork?.name}
      sx={{
        maxHeight: maxHeights[orientation] ?? 'none',
        maxWidth: maxWidths[orientation] ?? '100%',
        margin: 'auto',
      }}
    />
  );
}

const modelViewStyles = {
  model: {
    display: 'flex',
    height: [400, null, 500],
    width: '100%',
    boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.1)',
    borderRadius: 20,
    position: positionRelative,
    overflow: 'hidden',
    pointerEvents: pointerEventsNone,
  },
  threeDIcon: {
    display: 'flex',
    position: positionAbsolute,
    top: [18, null, 25],
    left: [18, null, 25],
    zIndex: 2,
    opacity: 0.5,
    color: 'black.100',
  },
};

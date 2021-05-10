/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, AspectRatio } from 'theme-ui';

import { getArtworkCardStyles } from './ArtworkCard';
import ArtworkCardTitleContainer from './subcomponents/ArtworkCardTitleContainer';
import GraySquare from 'components/GraySquare';

export default function ArtworkCardSkeleton(): JSX.Element {
  const sx = getArtworkCardStyles();

  return (
    <Box sx={{ ...sx.card, pointerEvents: 'none' }}>
      <AspectRatio ratio={1} sx={{ backgroundColor: 'black.5' }} />
      <ArtworkCardTitleContainer>
        <GraySquare sx={{ height: 29, width: '100%' }} />
        <GraySquare sx={{ height: 32, maxWidth: 180 }} />
      </ArtworkCardTitleContainer>
      <Box sx={{ padding: 'm' }}>
        <GraySquare sx={{ height: 56, width: '50%' }} />
      </Box>
    </Box>
  );
}

export function ArtworkCardSkeletonMinimal(): JSX.Element {
  const sx = getArtworkCardStyles();

  return (
    <Box sx={{ ...sx.card, pointerEvents: 'none' }}>
      <AspectRatio ratio={1} sx={{ backgroundColor: 'black.5' }} />
      <ArtworkCardTitleContainer>
        <GraySquare sx={{ height: 29, width: 240 }} />
        <GraySquare sx={{ height: 32, width: 180 }} />
      </ArtworkCardTitleContainer>
    </Box>
  );
}

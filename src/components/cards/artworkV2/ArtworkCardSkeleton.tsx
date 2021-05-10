/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, AspectRatio } from 'theme-ui';

import GraySquare from 'components/GraySquare';
import ArtworkCardContainer from 'components/cards/artworkV2/ArtworkCardContainer';

export default function ArtworkCardSkeleton(): JSX.Element {
  return (
    <ArtworkCardContainer>
      <AspectRatio
        ratio={1}
        sx={{ backgroundColor: 'black.5', marginBottom: 's' }}
      />

      <Box sx={{ paddingX: 'm' }}>
        <GraySquare sx={{ height: 32, width: 240, marginBottom: 's' }} />
        <GraySquare sx={{ width: 180, marginBottom: 'xs' }} />
        <GraySquare sx={{ width: 200, marginBottom: 'xs' }} />
        <GraySquare sx={{ width: 100, marginBottom: 'xs' }} />

        <Flex sx={{ alignItems: 'center', marginBottom: 's', marginTop: 's' }}>
          <GraySquare
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              marginRight: 'xs',
            }}
          />
          <GraySquare sx={{ width: 100 }} />
        </Flex>
      </Box>
    </ArtworkCardContainer>
  );
}

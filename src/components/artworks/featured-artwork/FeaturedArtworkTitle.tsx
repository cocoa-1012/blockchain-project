/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Heading } from 'theme-ui';

import Link from 'components/links/Link';

import Artwork from 'types/Artwork';

interface FeatureArtworkTitleProps {
  artworkPath: string;
  artwork: Artwork;
}

export default function FeatureArtworkTitle(
  props: FeatureArtworkTitleProps
): JSX.Element {
  const { artwork, artworkPath } = props;

  return (
    <Box sx={{ paddingTop: 's' }}>
      <Link href={artworkPath}>
        <a
          sx={{
            display: 'block',
            textDecoration: 'none',
            color: 'black.100',
          }}
        >
          <Heading variant="h.l" sx={{ fontSize: ['l', null, 'xl', 'xxl'] }}>
            {artwork.name}
          </Heading>
        </a>
      </Link>
    </Box>
  );
}

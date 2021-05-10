/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Heading, Text, Button } from 'theme-ui';

import Link from 'components/links/Link';

import { textAlignCenter } from 'types/styles';

export default function BidsEmptyState(): JSX.Element {
  const sx = getStyles();
  return (
    <Box sx={sx.container}>
      <Heading variant="h.m" sx={{ marginBottom: 's' }}>
        Your bids will be shown here
      </Heading>
      <Text variant="body.body" sx={sx.paragraph}>
        When you place or receive a bid on an artwork, it will show up here.
      </Text>
      <Link href="/artworks">
        <a>
          <Button variant="outline" sx={{ borderRadius: 999 }}>
            Explore Foundation
          </Button>
        </a>
      </Link>
    </Box>
  );
}

const getStyles = () => ({
  container: {
    maxWidth: 460,
    marginX: 'auto',
    textAlign: textAlignCenter,
  },
  paragraph: {
    maxWidth: 300,
    marginX: 'auto',
    marginBottom: 'l',
  },
});

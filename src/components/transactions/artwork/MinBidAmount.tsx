/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Grid } from 'theme-ui';

import { ceilETHWithSuffix } from 'utils/formatters';

interface MinBidAmountProps {
  minBidAmount: string;
  className?: string;
}

export default function MinBidAmount(props: MinBidAmountProps): JSX.Element {
  const { minBidAmount = '0', className } = props;
  return (
    <Grid gap={5} className={className}>
      <Text variant="h.xs" sx={{ color: 'black.60', marginRight: '0.5ch' }}>
        You must bid at least
      </Text>
      <Text variant="h.xs">{ceilETHWithSuffix(minBidAmount)}</Text>
    </Grid>
  );
}

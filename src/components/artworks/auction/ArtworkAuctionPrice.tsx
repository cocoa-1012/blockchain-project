/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';

import ETHinUSD from 'components/ETHinUSD';
import ArtworkAuctionInfoHeading from './ArtworkAuctionInfoHeading';

import { formatETHWithSuffix } from 'utils/formatters';

interface ArtworkAuctionPriceProps {
  label: string;
  amountInETH: string;
  className?: string;
}

export default function ArtworkAuctionPrice(
  props: ArtworkAuctionPriceProps
): JSX.Element {
  const { label, amountInETH, className } = props;
  return (
    <Box className={className}>
      <Text variant="h.body" sx={{ marginBottom: 5 }}>
        {label}
      </Text>
      <ArtworkAuctionInfoHeading>
        {formatETHWithSuffix(Number(amountInETH))}
      </ArtworkAuctionInfoHeading>
      <Text variant="h.xs" sx={{ color: 'black.60' }}>
        <ETHinUSD amount={amountInETH} />
      </Text>
    </Box>
  );
}

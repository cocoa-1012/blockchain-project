/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';

import useETHPrice from 'hooks/queries/use-eth-price';
import { formatCurrencyRaw } from 'utils/formatters';

interface ETHinUSDProps {
  amount: string;
}

export default function ETHinUSD(props: ETHinUSDProps): JSX.Element {
  const { amount } = props;

  const { price, isLoading } = useETHPrice();

  const parsedAmount = parseFloat(amount);

  if (isLoading) {
    return (
      <Text as="span" sx={{ opacity: 0 }}>
        —
      </Text>
    );
  }

  return <>{formatCurrencyRaw(parsedAmount * price)}</>;
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box, ThemeUIStyleObject, Flex } from 'theme-ui';

import ETHinUSD from 'components/ETHinUSD';

import { formatETHWithSuffix } from 'utils/formatters';

interface HistoryEventAmountProps {
  amountInETH: string;
  className?: string;
}

export default function HistoryEventAmount(
  props: HistoryEventAmountProps
): JSX.Element {
  const { amountInETH, className } = props;

  const sx = getStyles();

  return (
    <Flex sx={sx.container} className={className}>
      <Text variant="h.xs" sx={sx.amount}>
        {formatETHWithSuffix(amountInETH)}
      </Text>
      <Text variant="h.body" sx={sx.fiat}>
        <ETHinUSD amount={amountInETH} />
      </Text>
    </Flex>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    textAlign: 'right',
    flexDirection: [null, 'column'],
    justifyContent: 'space-between',
    flex: 1,
  };
  const amount: ThemeUIStyleObject = {
    fontSize: ['body', 'xs'],
    marginBottom: [null, 3],
    whiteSpace: 'pre',
  };
  const fiat: ThemeUIStyleObject = {
    color: 'black.60',
    fontSize: ['body', 'body'],
  };
  return { container, amount, fiat };
};

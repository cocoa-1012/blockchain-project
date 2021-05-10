/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex } from 'theme-ui';

import SpinnerStroked from 'components/SpinnerStroked';
import TransactionHashLink from './TransactionHashLink';

import { mobileAlignCenter } from 'components/transactions/styles';

interface TransactionPendingStateProps {
  txHash: string;
}

export default function TransactionPendingState(
  props: TransactionPendingStateProps
): JSX.Element {
  const { txHash } = props;
  return (
    <Grid gap={['m', null, 'l']}>
      <Flex sx={mobileAlignCenter}>
        <TransactionHashLink txHash={txHash} />
      </Flex>
      <Flex sx={mobileAlignCenter}>
        <SpinnerStroked size={62} />
      </Flex>
    </Grid>
  );
}

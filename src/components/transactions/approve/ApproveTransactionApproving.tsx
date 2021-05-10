/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

import TransactionContent from '../TransactionContent';
import TransactionPendingState from '../TransactionPendingState';

import { ApproveTransactionProps } from './types';

export default function ApproveTransactionApproving(
  props: ApproveTransactionProps
): JSX.Element {
  const { txHash } = props;

  return (
    <TransactionContent
      title={
        <Box sx={{ width: [null, null, 420] }}>
          The auction contract is being approved…
        </Box>
      }
      description={
        <Box sx={{ maxWidth: 360 }}>
          You have given the Foundation auction contract approval to list your
          NFTs for sale. This approval will be confirmed shortly.
        </Box>
      }
    >
      <TransactionPendingState txHash={txHash} />
    </TransactionContent>
  );
}

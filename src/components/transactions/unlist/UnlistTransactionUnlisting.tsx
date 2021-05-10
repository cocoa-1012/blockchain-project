/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import TransactionContent from '../TransactionContent';
import TransactionPendingState from '../TransactionPendingState';

import { UnlistTransactionProps } from './types';

export default function UnlistTransactionUnlisting(
  props: UnlistTransactionProps
): JSX.Element {
  const { txHash } = props;
  return (
    <TransactionContent
      title="This NFT is being unlisted."
      description="Your transaction has been submitted, and the artwork will be unlisted when the transaction is processed."
    >
      <TransactionPendingState txHash={txHash} />
    </TransactionContent>
  );
}

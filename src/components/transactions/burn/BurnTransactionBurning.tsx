/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import TransactionContent from '../TransactionContent';
import TransactionPendingState from '../TransactionPendingState';

import { BurnTransactionProps } from './types';

export default function BurnTransactionBurning(
  props: BurnTransactionProps
): JSX.Element {
  const { txHash } = props;
  return (
    <TransactionContent
      title="This NFT is being burned…"
      description="Your transaction has been submitted, and the NFT will be burned shortly. You’re free to leave this page if you like."
    >
      <TransactionPendingState txHash={txHash} />
    </TransactionContent>
  );
}

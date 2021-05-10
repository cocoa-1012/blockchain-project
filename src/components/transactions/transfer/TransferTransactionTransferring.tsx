/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import TransactionPendingState from '../TransactionPendingState';
import TransactionContent from '../TransactionContent';

import { TransferTransactionProps } from './types';

export default function TransferTransactionTransferring(
  props: TransferTransactionProps
): JSX.Element {
  const { txHash } = props;

  return (
    <TransactionContent
      title="This NFT is being transferred…"
      description="Your transaction has been submitted, and the NFT will be transferred shortly. You’re free to leave this page if you like."
    >
      <TransactionPendingState txHash={txHash} />
    </TransactionContent>
  );
}

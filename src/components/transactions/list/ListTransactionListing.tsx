/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import TransactionContainer from '../TransactionContainer';
import TransactionContent from '../TransactionContent';
import TransactionPendingState from '../TransactionPendingState';

import { ListTransactionProps } from './types';

export default function ListTransactionListing(
  props: ListTransactionProps
): JSX.Element {
  const { artwork, txHash } = props;
  return (
    <TransactionContainer artwork={artwork}>
      <TransactionContent
        title="Your NFT is being listed…"
        description="Your NFT has been submitted to our marketplace and will be live as soon as the transaction is processed. You’re free to leave this page if you like."
      >
        <TransactionPendingState txHash={txHash} />
      </TransactionContent>
    </TransactionContainer>
  );
}

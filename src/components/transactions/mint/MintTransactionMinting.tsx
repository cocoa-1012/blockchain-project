/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import TransactionPendingState from '../TransactionPendingState';
import TransactionContainer from '../TransactionContainer';
import TransactionContent from '../TransactionContent';

import { MintTransactionProps } from './types';
import useNavigationProgress from 'hooks/use-navigation-progress';

export default function MintTransactionMinting(
  props: MintTransactionProps
): JSX.Element {
  const { artwork, txHash } = props;

  useNavigationProgress({ percentCompleted: 50 });

  return (
    <TransactionContainer artwork={artwork}>
      <TransactionContent
        title="Your NFT is being minted…"
        description="Your artwork is being minted as an NFT on the Ethereum blockchain. This process will continue if you navigate away from this page."
      >
        <TransactionPendingState txHash={txHash} />
      </TransactionContent>
    </TransactionContainer>
  );
}

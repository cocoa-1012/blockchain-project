/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex } from 'theme-ui';

import SpinnerStroked from 'components/SpinnerStroked';
import ConnectedToWallet from 'components/ConnectedToWallet';
import TransactionContainer from '../TransactionContainer';
import TransactionContent from '../TransactionContent';

import { MintTransactionProps } from './types';

export default function MintTransactionSign(
  props: MintTransactionProps
): JSX.Element {
  const { artwork, publicAddress } = props;
  return (
    <TransactionContainer artwork={artwork}>
      <TransactionContent
        title="Mint your NFT"
        description="Confirm this transaction with your wallet to continue. Doing this will sign your wallet as the original creator of the NFT."
      >
        <Grid gap="xl">
          <ConnectedToWallet publicAddress={publicAddress} />
          <Flex>
            <SpinnerStroked size={62} />
          </Flex>
        </Grid>
      </TransactionContent>
    </TransactionContainer>
  );
}

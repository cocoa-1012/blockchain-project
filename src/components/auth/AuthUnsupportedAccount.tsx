/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text, Flex, Button } from 'theme-ui';
import { useWeb3React } from '@web3-react/core';
import { useLocalStorage } from 'react-use';

import ModalHeading from 'components/modals/common/ModalHeading';

import { WalletState, WalletProvider } from 'types/Wallet';

import useWalletState from 'state/stores/wallet';

export default function AuthUnsupportedAccount(): JSX.Element {
  const { deactivate } = useWeb3React();
  const [, , removeWalletConnect] = useLocalStorage<WalletProvider>(
    'walletconnect'
  );

  const setWalletState = useWalletState((state) => state.setWalletState);

  const handleBackButton = () => {
    setWalletState(WalletState.Disconnected);
    deactivate();
    removeWalletConnect();
  };

  return (
    <>
      <ModalHeading sx={{ maxWidth: 'none', marginBottom: 's' }}>
        This wallet is not supported yet
      </ModalHeading>
      <Grid gap="l" sx={{ paddingX: 's' }}>
        <Text variant="body.body" sx={{ textAlign: 'center', fontSize: 'sub' }}>
          We’re working to support multi-signature and smart-contract-based
          wallets soon. Please try again with another wallet.
        </Text>
        <Flex sx={{ justifyContent: 'center' }}>
          <Button sx={{ width: '100%' }} onClick={handleBackButton}>
            Back
          </Button>
        </Flex>
      </Grid>
    </>
  );
}

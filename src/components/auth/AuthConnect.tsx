/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text, Box } from 'theme-ui';
import { useState } from 'react';

import ModalHeading from 'components/modals/common/ModalHeading';
import ExternalInlineLink from 'components/links/ExternalInlineLink';
import MetaMaskGradientLink from 'components/auth/MetaMaskGradientLink';
import WalletConnectGradientLink from 'components/auth/WalletConnectGradientLink';

import { WalletProvider } from 'types/Wallet';
import { LastConnector } from 'state/stores/last-connector';

const WALLET_LEARN_LINK =
  'https://help.foundation.app/en/articles/4731452-a-complete-guide-to-getting-eth-and-a-wallet-with-metamask';

interface AuthConnectProps {
  handleAuth: ({ provider }: { provider: WalletProvider }) => void;
  authPending: boolean;
  lastConnector: LastConnector;
}

export default function AuthConnect(props: AuthConnectProps): JSX.Element {
  const { handleAuth, authPending, lastConnector } = props;

  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleAuthAndWalletSelection = ({
    provider,
  }: {
    provider: WalletProvider;
  }) => {
    handleAuth({ provider });
    setSelectedWallet(provider);
  };

  return (
    <>
      <ModalHeading sx={{ maxWidth: 'none', marginBottom: 's' }}>
        Connect your wallet.
      </ModalHeading>
      <Grid gap="l" sx={{ paddingX: [null, null, 's'] }}>
        <Text variant="body.body" sx={{ textAlign: 'center', fontSize: 'sub' }}>
          By connecting your wallet, you agree to our{` `}
          <ExternalInlineLink href="/terms" sx={{ fontSize: 'inherit' }}>
            Terms of Service
          </ExternalInlineLink>
          {` `}and our{` `}
          <ExternalInlineLink href="/privacy" sx={{ fontSize: 'inherit' }}>
            Privacy Policy
          </ExternalInlineLink>
          .
        </Text>
        <Box>
          {(lastConnector.wallet === WalletProvider.MetaMask ||
            !lastConnector.wallet) && (
            <MetaMaskGradientLink
              onClick={handleAuthAndWalletSelection}
              isLoading={
                selectedWallet === WalletProvider.MetaMask && authPending
              }
              sx={{ display: ['none', null, 'block'] }}
            />
          )}
          {(lastConnector.wallet === WalletProvider.WalletConnect ||
            !lastConnector.wallet) && (
            <WalletConnectGradientLink
              onClick={handleAuthAndWalletSelection}
              isLoading={
                selectedWallet === WalletProvider.WalletConnect && authPending
              }
            />
          )}
        </Box>
      </Grid>
      <Grid gap={2} sx={{ paddingTop: 'm', textAlign: 'center' }}>
        <Text variant="stnd.sub">New to Ethereum?</Text>
        <Text>
          <ExternalInlineLink sx={{ fontSize: 'sub' }} href={WALLET_LEARN_LINK}>
            Learn more about wallets
          </ExternalInlineLink>
        </Text>
      </Grid>
    </>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Button } from 'theme-ui';

import SpinnerStroked from 'components/SpinnerStroked';

import { WalletProvider } from 'types/Wallet';

import WalletConnectIcon from 'assets/icons/walletconnect-icon.svg';

interface WalletConnectGradientLinkProps {
  onClick: ({ provider }: { provider: WalletProvider }) => void;
  isLoading: boolean;
}

export default function WalletConnectGradientLink(
  props: WalletConnectGradientLinkProps
): JSX.Element {
  const { onClick, isLoading } = props;
  return (
    <Button
      onClick={() => onClick({ provider: WalletProvider.WalletConnect })}
      variant="blank"
      sx={{
        height: 60,
        width: '100%',
        backgroundImage:
          'linear-gradient(267.56deg, #0500FF 0%, #8F00FF 97.07%)',
        borderRadius: 10,
        textAlign: 'left',
        color: 'white.100',
        pointerEvents: isLoading ? 'none' : 'all',
      }}
    >
      {isLoading ? (
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          Connecting… <SpinnerStroked size={24} />
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          WalletConnect <WalletConnectIcon sx={{ width: 36 }} />
        </Flex>
      )}
    </Button>
  );
}

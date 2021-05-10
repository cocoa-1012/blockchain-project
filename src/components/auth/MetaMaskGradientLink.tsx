/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Button } from 'theme-ui';

import SpinnerStroked from 'components/SpinnerStroked';

import { WalletProvider } from 'types/Wallet';

import MetaMaskIcon from 'assets/icons/metamask-icon.svg';

interface MetaMaskGradientLinkProps {
  onClick: ({ provider }: { provider: WalletProvider }) => void;
  isLoading: boolean;
  className?: string;
}

export default function MetaMaskGradientLink(
  props: MetaMaskGradientLinkProps
): JSX.Element {
  const { onClick, isLoading, className } = props;
  return (
    <Button
      onClick={() => onClick({ provider: WalletProvider.MetaMask })}
      variant="blank"
      className={className}
      sx={{
        height: 60,
        width: '100%',
        backgroundImage:
          'linear-gradient(267.54deg, #FFDC24 1.63%, #FF5C00 98.05%)',
        borderRadius: 10,
        textAlign: 'left',
        color: 'white.100',
        pointerEvents: isLoading ? 'none' : 'all',
        mb: 'xs',
      }}
    >
      {isLoading ? (
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          Connecting… <SpinnerStroked size={24} />
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          MetaMask <MetaMaskIcon />
        </Flex>
      )}
    </Button>
  );
}

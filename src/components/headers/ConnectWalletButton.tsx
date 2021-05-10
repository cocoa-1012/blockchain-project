/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';
import { useCallback } from 'react';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';

interface ConnectWalletButtonProps {
  isDark: boolean;
  className?: string;
}

export default function ConnectWalletButton(
  props: ConnectWalletButtonProps
): JSX.Element {
  const { isDark, className } = props;

  const { setCurrentModal } = useModal();

  const openModal = useCallback(() => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  }, [setCurrentModal]);

  return (
    <Box sx={{ alignItems: 'center' }} className={className}>
      <Button
        variant={isDark ? 'white' : 'primary'}
        sx={{
          fontSize: 'xs',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 999,
          minHeight: [46, null, 54],
          maxHeight: [46, null, 54],
          paddingX: ['m', null, 'l'],
        }}
        onClick={openModal}
      >
        Connect
        <span sx={{ display: ['none', null, 'inline'] }}>{'\u00A0'}Wallet</span>
      </Button>
    </Box>
  );
}

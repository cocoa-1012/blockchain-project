/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text, Flex } from 'theme-ui';

import ExternalInlineLink from 'components/links/ExternalInlineLink';
import WalletLink from './WalletLink';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';

export default function ConnectWallet(): JSX.Element {
  const { setCurrentModal } = useModal();

  const openAuthModal = () => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 280, marginX: 'auto' }}>
        <Flex sx={{ display: 'inline', textOverflow: 'wrap' }}>
          <Text variant="body.body" sx={{ textAlign: 'center' }}>
            By connecting your wallet, you agree to our{` `}
            <ExternalInlineLink
              href="/terms"
              variant="h.body"
              sx={{ color: 'black.60' }}
            >
              Terms of Service
            </ExternalInlineLink>
            {` `}and our{` `}
            <ExternalInlineLink
              href="/privacy"
              variant="h.body"
              sx={{ color: 'black.60' }}
            >
              Privacy Policy
            </ExternalInlineLink>
            .
          </Text>
        </Flex>
        <Box sx={{ paddingTop: 'l' }}>
          <WalletLink onClick={openAuthModal} />
        </Box>
      </Box>
    </Box>
  );
}

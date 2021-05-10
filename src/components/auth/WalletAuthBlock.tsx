/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, ThemeUIStyleObject, Heading, Button } from 'theme-ui';

import Page, { PageProps } from 'components/Page';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';

interface WalletAuthBlockProps {
  pageProps?: PageProps;
}

export default function WalletAuthBlock(
  props: WalletAuthBlockProps
): JSX.Element {
  const { pageProps } = props;

  const { setCurrentModal } = useModal();

  const openAuthModal = () => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  };

  const sx: ThemeUIStyleObject = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const button: ThemeUIStyleObject = {
    borderRadius: 999,
    minHeight: 56,
  };

  const heading: ThemeUIStyleObject = {
    maxWidth: 380,
    marginX: 'auto',
    textAlign: 'center',
    marginBottom: 'l',
    lineHeight: 1.1,
  };

  if (pageProps) {
    return (
      <Page {...pageProps}>
        <Flex sx={sx}>
          <Heading variant="h.l" sx={heading}>
            Connect your wallet to continue.
          </Heading>
          <Button sx={button} onClick={openAuthModal}>
            Connect Wallet
          </Button>
        </Flex>
      </Page>
    );
  }

  return (
    <Flex sx={sx}>
      <Heading variant="h.l" sx={heading}>
        Connect your wallet to continue.
      </Heading>
      <Button sx={button} onClick={openAuthModal}>
        Connect Wallet
      </Button>
    </Flex>
  );
}

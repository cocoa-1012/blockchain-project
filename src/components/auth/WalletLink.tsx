/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';

import Link from 'components/links/Link';

interface WalletLinkProps {
  metaMaskUrl?: string;
  onClick?: () => void;
}

export default function WalletLink(props: WalletLinkProps): JSX.Element {
  const { metaMaskUrl, onClick } = props;

  if (onClick) {
    return (
      <Box onClick={onClick}>
        <WalletButton />
      </Box>
    );
  }

  return (
    <Box>
      <Link href={metaMaskUrl} key={metaMaskUrl}>
        <WalletButton />
      </Link>
    </Box>
  );
}

function WalletButton(): JSX.Element {
  return (
    <Button
      as="a"
      sx={{
        color: 'black.100',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white.100',
        textDecoration: 'none',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        width: '100%',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.05);',
      }}
    >
      Connect Wallet
    </Button>
  );
}

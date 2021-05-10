/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import WalletWrongNetwork from 'components/auth/WalletWrongNetwork';
import AuthContainer from 'components/auth/AuthContainer';

interface MetaMaskErrorProps {
  className?: string;
}

export default function MetaMaskError(props: MetaMaskErrorProps): JSX.Element {
  const { className } = props;
  return (
    <AuthContainer className={className}>
      <WalletWrongNetwork />
    </AuthContainer>
  );
}

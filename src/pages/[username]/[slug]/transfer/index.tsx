/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { any } from 'ramda';
import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useAuthToken from 'hooks/queries/use-auth-token';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import TransferContainer from 'components/transactions/transfer/TransferContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';

Transfer.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Transfer',
});

export default function Transfer(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: isBalanceLoading } = useBalance();

  const { isWrongNetwork } = useIsWrongNetwork();

  const loadingStates = [isUserLoading, isBalanceLoading];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <TransferContainer
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
      publicAddress={publicAddress}
    />
  );
}

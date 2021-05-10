/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { any } from 'ramda';
import { useState } from 'react';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useAuthToken from 'hooks/queries/use-auth-token';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import BurnContainer from 'components/transactions/burn/BurnContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';

Burn.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Burn',
});

export default function Burn(): JSX.Element {
  const { user, isLoading: isUserLoading } = useAuthToken();

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
    <BurnContainer
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
    />
  );
}

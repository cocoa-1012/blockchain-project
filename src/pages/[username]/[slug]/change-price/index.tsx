/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { any } from 'ramda';
import { useState } from 'react';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import ChangePriceContainer from 'components/transactions/changePrice/ChangePriceContainer';
import TransactionModerationGuard from 'components/trust-safety/TransactionModerationGuard';
import SpinnerStroked from 'components/SpinnerStroked';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';

ChangePrice.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Change Price',
});

export default function ChangePrice(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: balanceLoading } = useBalance();

  const { isWrongNetwork } = useIsWrongNetwork();

  const {
    isUserModerated,
    isLoading: isModerationStateLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const loadingStates = [
    isUserLoading,
    balanceLoading,
    isModerationStateLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isUserModerated) {
    return <TransactionModerationGuard moderationStatus={moderationStatus} />;
  }

  return (
    <ChangePriceContainer
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
    />
  );
}

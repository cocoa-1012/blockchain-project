/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { any } from 'ramda';
import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';
import useBalance from 'hooks/queries/use-balance';

import { WrappedTransactionLayout } from 'components/layouts/TransactionLayout';
import MintContainer from 'components/transactions/mint/MintContainer';
import TransactionModerationGuard from 'components/trust-safety/TransactionModerationGuard';
import TransactionLoadingPage from 'components/transactions/TransactionLoadingPage';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import {
  CreatorFlowStep,
  creatorFlowSteps,
} from 'components/transactions/navigationFlows';
import useNavigationProgress from 'hooks/use-navigation-progress';

Mint.getLayout = WrappedTransactionLayout({
  title: 'Mint',
  // on third progress
  percentCompleted: 36.5,
  navigationSteps: creatorFlowSteps,
  bodyClass: 'creator-flow',
});

export default function Mint(): JSX.Element {
  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: balanceLoading } = useBalance();

  const { isWrongNetwork } = useIsWrongNetwork();

  useNavigationProgress({
    percentCompleted: 36.5,
    activeStep: CreatorFlowStep.Mint,
  });

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
    return <TransactionLoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isUserModerated) {
    return <TransactionModerationGuard moderationStatus={moderationStatus} />;
  }

  return (
    <MintContainer
      balance={balance}
      authToken={user?.token}
      publicAddress={publicAddress}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
    />
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { any } from 'ramda';
import { useCallback, useState } from 'react';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';
import usePendingTransactionStatus from 'hooks/web3/use-pending-transaction-status';
import {
  useValidSocialVerificationTwitter,
  useValidSocialVerificationInstagram,
} from 'hooks/queries/hasura/use-social-verification';
import useUserOneTimeActions from 'hooks/queries/hasura/use-user-one-time-action';
import useBodyClass from 'hooks/use-body-class';
import useNavigationProgress from 'hooks/use-navigation-progress';

import { WrappedTransactionLayout } from 'components/layouts/TransactionLayout';
import UploadArtworkContainer from 'components/uploads/artwork/UploadArtworkContainer';
import MetaMaskError from 'components/auth/MetaMaskError';
import ApprovedCreatorError from 'components/auth/ApprovedCreatorError';
import TransactionModerationGuard from 'components/trust-safety/TransactionModerationGuard';
import TransactionLoadingPage from 'components/transactions/TransactionLoadingPage';
import AgreeToTOSBlock from 'components/trust-safety/AgreeToTOSBlock';
import VerifySocialBlockCustomRedirect from 'components/trust-safety/VerifySocialBlockCustomRedirect';
import { HideTransactionLayoutNav } from 'components/transactions/TransactionNavigation';
import {
  CreatorFlowStep,
  creatorFlowSteps,
} from 'components/transactions/navigationFlows';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';

import { isAccountApprovedCreator } from 'utils/users';
import { getFirstValue } from 'utils/helpers';

import SocialVerification from 'types/SocialVerification';
import { ActionType } from 'types/ActionType';

UploadArtwork.getLayout = WrappedTransactionLayout({
  title: 'Upload',
  percentCompleted: 0,
  navigationSteps: creatorFlowSteps,
});

export default function UploadArtwork(): JSX.Element {
  const { user, isLoading: isUserLoading } = useAuthToken();

  useBodyClass('creator-flow');

  const publicAddress = user?.publicAddress;

  useNavigationProgress({
    percentCompleted: 0,
    activeStep: CreatorFlowStep.Upload,
  });

  const { hasPendingTransactions, isLoading: pendingTxStatusIsLoading } =
    usePendingTransactionStatus(publicAddress);

  const {
    data: twitterSocialVerificationData,
    loading: twitterSocialVerificationLoading,
  } = useValidSocialVerificationTwitter({ publicKey: publicAddress });

  const twitterSocialVerification: SocialVerification = getFirstValue(
    twitterSocialVerificationData?.socialVerifications
  );

  const {
    data: instagramSocialVerificationData,
    loading: instagramSocialVerificationLoading,
  } = useValidSocialVerificationInstagram({ publicKey: publicAddress });

  const instagramSocialVerification: SocialVerification = getFirstValue(
    instagramSocialVerificationData?.socialVerifications
  );

  const socialVerificationLoading =
    twitterSocialVerificationLoading || instagramSocialVerificationLoading;

  // use a key to allow the form state to be reset
  const [resetKey, setResetKey] = useState(Date.now());
  const [isDismissed, setIsDismissed] = useState(false);

  const resetTransaction = useCallback(() => {
    const now = Date.now();
    setResetKey(now);
  }, [setResetKey]);

  const { isWrongNetwork } = useIsWrongNetwork();

  const { data: serverUserData } = useUserByPublicKey({
    publicKey: publicAddress,
  });

  const { data: oneTimeActionsData, isLoading: oneTimeActionsLoading } =
    useUserOneTimeActions({
      publicAddress,
      actionType: ActionType['AcceptWelcomeScreen1.0'],
    });

  const hasAcceptedTOS = oneTimeActionsData?.oneTimeActions.length > 0;

  const isApprovedCreator = isAccountApprovedCreator(serverUserData?.user);

  const {
    isUserModerated,
    isLoading: isModerationStateLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const loadingStates = [
    isUserLoading,
    isModerationStateLoading,
    socialVerificationLoading,
    oneTimeActionsLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <TransactionLoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isWrongNetwork) {
    return <MetaMaskError sx={{ paddingBottom: 'xxl' }} />;
  }

  if (!isApprovedCreator) {
    return <ApprovedCreatorError sx={{ paddingBottom: 'xxl' }} />;
  }

  if (isUserModerated) {
    return <TransactionModerationGuard moderationStatus={moderationStatus} />;
  }

  if (!hasAcceptedTOS) {
    return (
      <>
        <HideTransactionLayoutNav />
        <AgreeToTOSBlock token={user?.token} />
      </>
    );
  }

  if (
    !twitterSocialVerification?.isValid &&
    !instagramSocialVerification?.isValid
  ) {
    return (
      <>
        <HideTransactionLayoutNav />
        <VerifySocialBlockCustomRedirect />
      </>
    );
  }

  // Commenting out this code until we have more reliable connection checks with ether provider
  // if (hasPendingTransactions && !isDismissed) {
  //   return (
  //     <TransactionPendingWarningBlock
  //       message="We recommend waiting for any pending transactions to finish before continuing."
  //       onDismiss={() => {
  //         setIsDismissed(true);
  //       }}
  //     />
  //   );
  // }

  // TODO: Rename token prop to something
  // that makes it clearer it's not a crypto token
  return (
    <UploadArtworkContainer
      resetTransaction={resetTransaction}
      key={resetKey}
      token={user?.token}
      publicAddress={publicAddress}
    />
  );
}

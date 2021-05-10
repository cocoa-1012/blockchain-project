/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
// Note: This list is for secondary sales
import { jsx } from 'theme-ui';
import { useState } from 'react';
import { useRouter } from 'next/router';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';
import useArtworkByTokenId from 'hooks/queries/use-artwork-by-token-id';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import useUnsupportedFlow from 'hooks/use-unsupported-flow';

import SecondaryListContainer from 'components/transactions/secondaryList/SecondaryListContainer';
import TransactionModerationGuard from 'components/trust-safety/TransactionModerationGuard';
import TransactionLoadingPage from 'components/transactions/TransactionLoadingPage';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import { WrappedTransactionLayout } from 'components/layouts/TransactionLayout';
import SecondaryListMissingVerification from 'components/transactions/secondaryList/SecondaryListMissingVerification';
import TransactionContainer from 'components/transactions/TransactionContainer';
import VerifySocialBlockCustomRedirect from 'components/trust-safety/VerifySocialBlockCustomRedirect';
import MobileNotSupportedModal from 'components/modals/MobileNotSupportedModal';

import { getFirstValue, isAnyTrue, notEmptyOrNil } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import useApproval from 'hooks/queries/subgraph/use-approval';
import { useEffect } from 'react';
import { buildArtworkPath } from 'utils/artwork/artwork';

SecondaryList.getLayout = WrappedTransactionLayout({
  title: 'List',
});

export default function SecondaryList(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const [resetKey, setResetKey] = useState<number>(Date.now());

  const [isBlocked, setIsBlocked] = useState(true);

  const router = useRouter();

  const slug = getFirstValue(router.query.slug);

  const tokenId = getTokenId(slug);

  const { data: artworkData, isLoading: isArtworkDataLoading } =
    useArtworkByTokenId({ tokenId });

  useUnsupportedFlow();

  const { data: approvalData, isSuccess: isApprovalLoaded } = useApproval({
    publicKey: publicAddress,
  });
  const hasApprovedMarketContract = notEmptyOrNil(
    approvalData?.account?.nftAccountApprovals
  );

  useEffect(() => {
    if (isApprovalLoaded && !hasApprovedMarketContract && artworkData) {
      const artworkPath = buildArtworkPath({
        artwork: artworkData,
        user: artworkData?.creator,
      });

      router.push(`${artworkPath}/approve`);
    }
  }, [
    isApprovalLoaded,
    hasApprovedMarketContract,
    router,
    artworkData,
    isArtworkDataLoading,
  ]);

  const {
    isUserModerated,
    isLoading: isModerationStateLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const creatorPublicKey = artworkData?.creator?.id;

  const {
    data: socialVerificationsData,
    isLoading: socialVerificationsLoading,
  } = useSocialVerifications({ publicKey: creatorPublicKey });

  const {
    data: currentUserSocialVerifsData,
    isLoading: currentUserSocialVerifsLoading,
  } = useSocialVerifications({ publicKey: publicAddress });

  const { data: userData, isLoading: userIsLoading } = useUserByPublicKey({
    publicKey: publicAddress,
  });

  const currentUser = userData?.user;

  const currentUserHasSocialVerification = notEmptyOrNil(
    currentUserSocialVerifsData?.socialVerifications ?? []
  );

  const hasSocialVerification = notEmptyOrNil(
    socialVerificationsData?.socialVerifications ?? []
  );

  const isLoading = isAnyTrue([
    isUserLoading,
    isModerationStateLoading,
    socialVerificationsLoading,
    currentUserSocialVerifsLoading,
    userIsLoading,
    !hasApprovedMarketContract,
  ]);

  if (isLoading) {
    return <TransactionLoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isUserModerated) {
    return <TransactionModerationGuard moderationStatus={moderationStatus} />;
  }

  if (!hasSocialVerification) {
    return (
      <TransactionContainer artwork={artworkData}>
        <SecondaryListMissingVerification currentUser={currentUser} />
      </TransactionContainer>
    );
  }

  if (!currentUserHasSocialVerification && isBlocked) {
    return (
      <VerifySocialBlockCustomRedirect handleSkip={() => setIsBlocked(false)} />
    );
  }

  return (
    <>
      <MobileNotSupportedModal />
      <SecondaryListContainer
        authToken={user?.token}
        key={resetKey}
        resetTransaction={() => setResetKey(Date.now())}
        publicAddress={publicAddress}
      />
    </>
  );
}

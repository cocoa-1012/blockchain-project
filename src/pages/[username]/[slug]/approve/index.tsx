/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { any } from 'ramda';
import { useState } from 'react';
import { useRouter } from 'next/router';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useBalance from 'hooks/queries/use-balance';
import useAuthToken from 'hooks/queries/use-auth-token';
import useArtworkByTokenId from 'hooks/queries/use-artwork-by-token-id';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import ApproveContainer from 'components/transactions/approve/ApproveContainer';
import SpinnerStroked from 'components/SpinnerStroked';

import { getFirstValue, notEmptyOrNil } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';

Approve.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Approve',
});

export default function Approve(): JSX.Element {
  const { user, isLoading: isUserLoading } = useAuthToken();

  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const router = useRouter();

  const slug = getFirstValue(router.query.slug);

  const tokenId = getTokenId(slug);

  const { data: artworkData, isLoading: artworkLoading } = useArtworkByTokenId({
    tokenId,
  });

  const creatorPublicKey = artworkData?.creator?.id;

  const publicAddress = user?.publicAddress;

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

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: balanceLoading } = useBalance();

  const currentUser = userData?.user;

  const { isWrongNetwork } = useIsWrongNetwork();

  const loadingStates = [
    isUserLoading,
    balanceLoading,
    artworkLoading,
    socialVerificationsLoading,
    currentUserSocialVerifsLoading,
    userIsLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <ApproveContainer
      balance={balance}
      authToken={user?.token}
      key={resetKey}
      resetTransaction={() => setResetKey(Date.now())}
      isWrongNetwork={isWrongNetwork}
      hasSocialVerification={notEmptyOrNil(
        socialVerificationsData?.socialVerifications ?? []
      )}
      currentUserHasSocialVerification={notEmptyOrNil(
        currentUserSocialVerifsData?.socialVerifications ?? []
      )}
      artwork={artworkData}
      currentUser={currentUser}
    />
  );
}

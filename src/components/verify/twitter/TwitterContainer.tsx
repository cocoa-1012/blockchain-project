/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { TwitterFormValues } from './types';

import TwitterView from 'components/verify/twitter/TwitterView';

import useCreateSocialVerificationViaURL from 'hooks/mutations/server/use-create-social-verification-via-url';
import useSocialVerificationTwitter from 'hooks/queries/hasura/use-social-verification';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAuthToken from 'hooks/queries/use-auth-token';

import TwitterSuccess from '../shared/SocialSuccess';
import TwitterVerifying from '../shared/SocialVerifying';
import SocialError from '../shared/SocialError';
import LoadingPage from 'components/LoadingPage';

import { getFirstValue } from 'utils/helpers';
import Sentry from 'lib/clients/sentry';
import SocialVerification from 'types/SocialVerification';

interface TwitterContainerProps {
  authToken: string;
  publicAddress: string;
  reset: (arg0: number) => void;
  key: number;
}

export default function TwitterContainer(
  props: TwitterContainerProps
): JSX.Element {
  const { authToken: token, publicAddress, reset } = props;

  const router = useRouter();

  const redirectPath = getFirstValue(router.query['redirect-path']);

  const [isCreateError, setIsCreateError] = useState(false);
  const [tweetURL, setTweetURL] = useState('');

  const { user } = useAuthToken();
  const { data: userData } = useUserByPublicKey({ publicKey: publicAddress });

  const usernameOrPublicKey = userData?.user?.username ?? publicAddress;

  const [
    createSocialVerification,
    {
      loading: createSocialVerificationLoading,
      error: createSocialVerificationError,
    },
  ] = useCreateSocialVerificationViaURL(token);

  const POLL_INTERVAL = 2000;

  // TODO: Use skip param to stop polling on success or error screen
  const {
    data: socialVerificationData,
    loading: socialVerificationLoading,
    error: socialVerificationGetError,
  } = useSocialVerificationTwitter({
    publicKey: user?.publicAddress,
    pollInterval: POLL_INTERVAL,
    context: { endpoint: 'hasura' },
  });

  const hasVerificationResult = !socialVerificationGetError;

  const socialVerification: SocialVerification = getFirstValue(
    socialVerificationData?.socialVerifications
  );

  const isValid = socialVerification?.isValid;
  const socialVerificationURL = socialVerification?.socialVerificationURL;
  const failedReason = socialVerification?.failedReason;

  const handleSubmit = useCallback(
    async (values: TwitterFormValues): Promise<void> => {
      const tweetURLString: string = values.tweetURL;
      setTweetURL(tweetURLString);
      try {
        await createSocialVerification({
          variables: { socialVerificationURL: tweetURLString },
        });
      } catch (error) {
        // This is most likely because they used a tweet URL that
        // has been used before
        setIsCreateError(true);
      }
    },
    [createSocialVerification]
  );

  // Only once it's marked as isValid of true or false, not when it's
  // null since we don't fetch that
  const newDataInDB = tweetURL === socialVerificationURL;

  const isSuccessful = isValid && newDataInDB;
  const isLoading =
    socialVerificationLoading || createSocialVerificationLoading;
  const isVerifying = !newDataInDB && !!tweetURL;
  const isError =
    (newDataInDB &&
      !isValid &&
      hasVerificationResult &&
      tweetURL === socialVerificationURL) ||
    isCreateError ||
    createSocialVerificationError;

  // console.log({
  //   socialVerificationLoading,
  //   createSocialVerificationLoading,
  //   newDataInDB,
  //   isValid,
  //   hasVerificationResult,
  //   isCreateError,
  //   socialVerificationGetError,
  //   tweetURL,
  //   socialVerificationURL,
  // });
  // console.log({
  //   isSuccessful,
  //   isError,
  //   isVerifying,
  //   isLoading,
  // });

  useEffect(() => {
    if (!isError && !isLoading && !isVerifying && !isSuccessful) {
      Sentry.captureMessage(
        'User encountered unhandled case on Twitter verification'
      );
    }
  }, [isError, isLoading, isSuccessful, isVerifying]);

  if (isSuccessful) {
    return (
      <TwitterSuccess
        usernameOrPublicKey={usernameOrPublicKey}
        redirectPath={redirectPath}
      />
    );
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  // If there's an entry but there was no Twitter username fetched from
  // the tweet, the hook that fetches data for this page
  // will return an error, and thus there won't be
  // a verification result.

  if (isError) {
    return (
      <SocialError
        failedReason={failedReason}
        reset={() => {
          reset(Date.now());
        }}
      />
    );
  }

  if (isVerifying) {
    return <TwitterVerifying />;
  }

  return <TwitterView onSubmit={handleSubmit} />;
}

/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import InstagramView from 'components/verify/instagram/InstagramView';

import { useSocialVerificationInstagram } from 'hooks/queries/hasura/use-social-verification';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAuthToken from 'hooks/queries/use-auth-token';

import SocialSuccess from '../shared/SocialSuccess';
import SocialVerifying from '../shared/SocialVerifying';
import SocialError from '../shared/SocialError';
import LoadingPage from 'components/LoadingPage';

import { getFirstValue } from 'utils/helpers';
import Sentry from 'lib/clients/sentry';
import SocialVerification, {
  ServiceName,
  SocialVerifStatus,
} from 'types/SocialVerification';
import useCreateInstagramVerification from 'hooks/mutations/server/use-create-instagram-verification';
import useOverwriteInstagramVerification from 'hooks/mutations/server/use-overwrite-instagram-verification';
import InstagramDuplicate from './InstagramDuplicate';

interface InstagramContainerProps {
  authToken: string;
  publicAddress: string;
  reset: (arg0: number) => void;
  key: number;
}

export default function InstagramContainer(
  props: InstagramContainerProps
): JSX.Element {
  const { authToken: token, publicAddress, reset } = props;

  const router = useRouter();

  // Note: state is how we get the Instagram API to return
  // the value that we call redirect-path
  // InstagramShareButton within InstagramView
  // uses the redirect-path query param (used more directly in the Twitter flow)
  // to pass through as state following the Instagram API docs
  // https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/

  const code = getFirstValue(router.query['code']);
  const redirectPath = getFirstValue(router.query['redirect-path']);
  const error = getFirstValue(router.query['error']);
  const errorReason = getFirstValue(router.query['error_reason']);
  const errorDescription = getFirstValue(router.query['error_description']);
  const stateWithStringAtEnd = getFirstValue(router.query['state']);
  const states = stateWithStringAtEnd ? stateWithStringAtEnd.split('#_') : [''];
  const state = states[0];

  const windowLocationHref = window.location.href;

  // without the redirect-path part
  const partsOfURL = windowLocationHref.split('?');
  const redirectURIForMutation = partsOfURL[0];

  const [isCreateError, setIsCreateError] = useState(false);
  const [isOverwriteBackgroundProcessLoading, setIsOverwriteLoading] = useState(
    false
  );
  const [overwriteToTrack, setOverwriteToTrack] = useState('');
  const [usedCode, setUsedCode] = useState(false);

  const { user } = useAuthToken();
  const { data: userData } = useUserByPublicKey({ publicKey: publicAddress });

  const usernameOrPublicKey = userData?.user?.username ?? publicAddress;

  const [
    createInstagramVerification,
    {
      loading: createInstagramSocialVerificationLoading,
      error: createInstagramSocialVerificationError,
    },
  ] = useCreateInstagramVerification({
    code: code,
    redirectURI: redirectURIForMutation,
    token,
  });

  useEffect(() => {
    async function createVerifOnServer(code) {
      await createInstagramVerification(code);
    }
    if (code && !usedCode) {
      createVerifOnServer(code);
      setUsedCode(true);
    }
  }, [code, createInstagramVerification, usedCode]);

  const POLL_INTERVAL = 2000;

  // TODO: Use skip param to stop polling on success or error screen
  const {
    data: socialVerificationData,
    loading: socialVerificationLoading,
    error: socialVerificationGetError,
  } = useSocialVerificationInstagram({
    publicKey: user?.publicAddress,
    pollInterval: POLL_INTERVAL,
  });

  const socialVerification: SocialVerification = getFirstValue(
    socialVerificationData?.socialVerifications
  );

  useEffect(() => {
    if (
      isOverwriteBackgroundProcessLoading &&
      socialVerification?.id === overwriteToTrack &&
      socialVerification?.status !== SocialVerifStatus.USERNAME_IN_USE
    ) {
      setIsOverwriteLoading(false);
      setOverwriteToTrack('');
    }
  }, [
    isOverwriteBackgroundProcessLoading,
    socialVerification?.id,
    socialVerification?.status,
    overwriteToTrack,
  ]);

  const [
    overwriteInstagramVerification,
    {
      loading: overwriteInstagramSocialVerificationLoading,
      error: overwriteInstagramSocialVerificationError,
    },
  ] = useOverwriteInstagramVerification({
    id: socialVerification?.id,
    token,
  });

  const hasVerificationResult =
    socialVerification && !socialVerificationGetError;

  const isValid = socialVerification?.isValid;

  const isSuccessful = isValid;
  const isLoading =
    socialVerificationLoading ||
    createInstagramSocialVerificationLoading ||
    overwriteInstagramSocialVerificationLoading ||
    isOverwriteBackgroundProcessLoading;

  const isError =
    (!isValid && hasVerificationResult) ||
    isCreateError ||
    createInstagramSocialVerificationError ||
    overwriteInstagramSocialVerificationError ||
    error;

  const isVerifying = !!code;

  const isDuplicate =
    socialVerification?.status === SocialVerifStatus.USERNAME_IN_USE;

  // console.log({
  //   socialVerificationLoading,
  //   createInstagramSocialVerificationLoading,
  //   isValid,
  //   hasVerificationResult,
  //   isCreateError,
  //   socialVerificationGetError,
  //   createInstagramSocialVerificationError,
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
        'User encountered unhandled case on Instagram verification'
      );
    }
  }, [isError, isLoading, isSuccessful, isVerifying]);

  if (isSuccessful) {
    return (
      <SocialSuccess
        usernameOrPublicKey={usernameOrPublicKey}
        redirectPath={state ? state : redirectPath}
        serviceName="Instagram"
      />
    );
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  // TODO: Handle loading state
  if (isDuplicate) {
    return (
      <InstagramDuplicate
        handleClick={() => {
          setIsOverwriteLoading(true);
          setOverwriteToTrack(socialVerification?.id);
          overwriteInstagramVerification();
        }}
      />
    );
  }

  // TODO: Consider putting more information on the error screen
  // about why it failed
  if (isError) {
    return (
      <SocialError
        serviceName={ServiceName.INSTAGRAM}
        redirectPath={state ? state : redirectPath}
        socialVerificationID={socialVerification?.id}
      />
    );
  }

  if (isVerifying) {
    return <SocialVerifying serviceName={ServiceName.INSTAGRAM} />;
  }

  // Note: InstagramShareButton within InstagramView
  // uses the redirect-path query param to pass through as
  // state following the Instagram API docs
  // https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/
  return <InstagramView />;
}

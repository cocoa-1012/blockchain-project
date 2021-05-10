/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, ThemeUIStyleObject, Flex } from 'theme-ui';
import { ReactNode } from 'react';
import { any } from 'ramda';

import UpvoteJoin from 'components/waitlist/UpvoteJoin';
import UpvoteStatus from 'components/waitlist/UpvoteStatus';

import {
  useValidSocialVerificationInstagram,
  useValidSocialVerificationTwitter,
} from 'hooks/queries/hasura/use-social-verification';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAuthToken from 'hooks/queries/use-auth-token';

import { isOnWaitlist } from 'utils/users';
import { getFirstValue } from 'utils/helpers';

import { WaitlistTotalCountResponse } from 'queries/hasura/waitlist';

import SocialVerification from 'types/SocialVerification';
import LoadingPage from 'components/LoadingPage';

interface InviteOnlyOverlayProps {
  children: JSX.Element;
  enabled: boolean;
  waitlistCount: WaitlistTotalCountResponse;
}

export default function InviteOnlyOverlay(
  props: InviteOnlyOverlayProps
): JSX.Element {
  const { children, enabled, waitlistCount } = props;

  if (!enabled) {
    return children;
  }

  return (
    <>
      <InviteOnlyContent waitlistCount={waitlistCount} />
      <Box sx={{ filter: 'blur(20px)' }}>{children}</Box>
    </>
  );
}

interface InviteOnlyContentProps {
  waitlistCount: WaitlistTotalCountResponse;
}

function InviteOnlyContent(props: InviteOnlyContentProps): JSX.Element {
  const { waitlistCount } = props;

  const { user, isLoading: isLoadingUser } = useAuthToken();

  const publicAddress = user?.publicAddress;
  const token = user?.token;

  const {
    data: twitterSocialVerificationData,
    loading: isLoadingTwitterVerification,
  } = useValidSocialVerificationTwitter({ publicKey: user?.publicAddress });

  const twitterSocialVerification: SocialVerification = getFirstValue(
    twitterSocialVerificationData?.socialVerifications
  );

  const {
    data: instagramSocialVerificationData,
    loading: isLoadingInstagramVerification,
  } = useValidSocialVerificationInstagram({ publicKey: user?.publicAddress });

  const instagramSocialVerification: SocialVerification = getFirstValue(
    instagramSocialVerificationData?.socialVerifications
  );

  const isLoadingVerification =
    isLoadingTwitterVerification || isLoadingInstagramVerification;

  // TODO: Possibly extract this logic into a hook called useIsVerified
  const isVerified =
    twitterSocialVerification?.isValid || instagramSocialVerification?.isValid;

  const { data: userData, isLoading: isLoadingServerUser } = useUserByPublicKey(
    {
      publicKey: publicAddress,
      refetchOnWindowFocus: false,
    }
  );

  const currentUser = userData?.user;
  const isApprovedCreator = currentUser?.isApprovedCreator;
  const onWaitlist = isOnWaitlist(currentUser);

  const totalUserCount = waitlistCount?.user_aggregate?.aggregate?.count;

  const loadingStates = [
    isLoadingServerUser,
    isLoadingUser,
    isLoadingVerification,
  ];

  const isLoading = any(Boolean, loadingStates);

  const sx = getStyles();

  if (isLoading) {
    return <LoadingPage sx={sx.loading} />;
  }

  return (
    <Box sx={sx.container}>
      <Flex sx={sx.body}>
        {/* Before they are on the waitlist */}
        {!onWaitlist && !isApprovedCreator && (
          <UpvoteJoin
            token={token}
            publicAddress={publicAddress}
            isVerified={isVerified}
            onWaitlist={onWaitlist}
            isLoading={isLoading}
            isApprovedCreator={isApprovedCreator}
            twitterSocialVerification={twitterSocialVerification}
            instagramSocialVerification={instagramSocialVerification}
            currentUser={currentUser}
            totalUserCount={totalUserCount}
          />
        )}
        {/* Once they are on the waitlist */}
        {onWaitlist && !isApprovedCreator && (
          <UpvoteStatus
            token={token}
            publicAddress={publicAddress}
            isVerified={isVerified}
            onWaitlist={onWaitlist}
            isLoading={isLoading}
            isApprovedCreator={isApprovedCreator}
            twitterSocialVerification={twitterSocialVerification}
            instagramSocialVerification={instagramSocialVerification}
            currentUser={currentUser}
            totalUserCount={totalUserCount}
          />
        )}
      </Flex>
    </Box>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const body: ThemeUIStyleObject = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const loading: ThemeUIStyleObject = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 999,
    transform: 'translate(-50%, -50%)',
    padding: 0,
  };

  return { container, body, loading };
};

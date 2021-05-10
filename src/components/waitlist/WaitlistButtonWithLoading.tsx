/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, ThemeUIStyleObject, Text } from 'theme-ui';

import WaitlistVoteButton, {
  WaitlistVoteButtonSkeleton,
} from './WaitlistVoteButton';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useUsedWaitlistVotes from 'hooks/queries/hasura/use-used-waitlist-votes';

import {
  useValidSocialVerificationTwitter,
  useValidSocialVerificationInstagram,
} from 'hooks/queries/hasura/use-social-verification';

import { getFirstValue } from 'utils/helpers';
import { getWaitlistVoteInfo } from 'utils/waitlist';

import Account from 'types/Account';
import SocialVerification from 'types/SocialVerification';

interface WaitlistButtonWithLoadingProps {
  user: Account;
  publicAddress: string;
  isMyProfile: boolean;
  token: string;
  isVerified?: boolean;
  className?: string;
}

export default function WaitlistButtonWithLoading(
  props: WaitlistButtonWithLoadingProps
): JSX.Element {
  const { publicAddress, token, user, className } = props;

  const sx = getStyles();

  const { data: currentUserData } = useUserByPublicKey({
    publicKey: publicAddress,
  });

  const {
    data: twitterSocialVerificationData,
  } = useValidSocialVerificationTwitter({
    publicKey: publicAddress,
  });

  const twitterSocialVerification: SocialVerification = getFirstValue(
    twitterSocialVerificationData?.socialVerifications
  );

  const {
    data: instagramSocialVerificationData,
  } = useValidSocialVerificationInstagram({
    publicKey: publicAddress,
  });

  const instagramSocialVerification: SocialVerification = getFirstValue(
    instagramSocialVerificationData?.socialVerifications
  );

  const currentUser = currentUserData?.user;

  const {
    data: usedVotesData,
    isLoading: usedVotesIsLoading,
  } = useUsedWaitlistVotes({ publicKey: publicAddress });

  const { currentUserHasVoted, hasNoVotes } = getWaitlistVoteInfo({
    usedVotesData,
    currentUser,
    user,
  });

  const isLoading = usedVotesIsLoading;

  return (
    <Box sx={sx.container} className={className}>
      <Flex sx={sx.flex}>
        <Box>
          {isLoading ? (
            <WaitlistVoteButtonSkeleton />
          ) : (
            <Flex sx={{ flexDirection: 'row' }}>
              <WaitlistVoteButton
                token={token}
                publicAddress={user?.publicKey}
                currentUserHasVoted={currentUserHasVoted}
                hasNoVotes={hasNoVotes}
                isVerified={
                  twitterSocialVerification?.isValid ||
                  instagramSocialVerification?.isValid
                }
                isLoggedIn={Boolean(publicAddress)}
                isLoading={isLoading}
              />
              <Text
                variant="stnd.sub"
                sx={{
                  marginLeft: 'm',
                  maxWidth: 300,
                  color: 'black.60',
                  fontSize: 'sub',
                  lineHeight: 1.6,
                }}
              >
                Give this profile an upvote so they can receive early access to
                Foundation’s creator tools.
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    alignSelf: 'flex-start',
  };

  const flex: ThemeUIStyleObject = {
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return { container, flex };
};

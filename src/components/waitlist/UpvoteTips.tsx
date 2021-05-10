/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { Box, Flex, Grid, jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

import { positionRelative, textAlignRight } from 'types/styles';
import Account from 'types/Account';
import SocialVerification from 'types/SocialVerification';

import { transitions } from 'utils/themes/main/theme';

import CheckIcon from 'assets/icons/check-icon.svg';
import { notEmptyOrNil } from 'utils/helpers';
import { all } from 'ramda';
import Link from 'components/links/Link';

export interface UpvoteTipsProps {
  currentUser: Account;
  totalUserCount: number;
  token: string;
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
}

export default function UpvoteTips(props: UpvoteTipsProps): JSX.Element {
  const {
    twitterSocialVerification,
    instagramSocialVerification,
    currentUser,
  } = props;

  const hasRequiredInfo = all(notEmptyOrNil, [
    currentUser?.profileImageUrl,
    currentUser?.coverImageUrl,
    currentUser?.bio,
  ]);

  return (
    <Box>
      <Box sx={sx.activeUserInfo}>
        <Text variant="h.s">Tips for getting access earlier…</Text>
        <Grid gap="m">
          <VerificationStep isChecked={twitterSocialVerification?.isValid}>
            <VerificationStepLink href="/profile/verify/twitter">
              <Text variant="h.xs">Verify your Twitter</Text>
            </VerificationStepLink>
          </VerificationStep>
          <VerificationStep isChecked={instagramSocialVerification?.isValid}>
            <VerificationStepLink href="/profile/verify/instagram">
              <Text variant="h.xs">Verify your Instagram</Text>
            </VerificationStepLink>
          </VerificationStep>
          <VerificationStep isChecked={hasRequiredInfo}>
            <VerificationStepLink href="/profile">
              <Grid gap="xs">
                <Text variant="h.xs">Complete your Profile</Text>
                <Text variant="stnd.sub" sx={{ color: 'black.60' }}>
                  Upload a profile image, cover image and add a bio.
                </Text>
              </Grid>
            </VerificationStepLink>
          </VerificationStep>
        </Grid>
      </Box>
    </Box>
  );
}

interface VerificationStepLinkProps {
  href: string;
  children: ReactNode;
}

function VerificationStepLink(props: VerificationStepLinkProps): JSX.Element {
  const { children, href } = props;
  return (
    <Link href={href}>
      <a
        sx={{
          textDecoration: 'none',
          display: 'block',
          color: 'black.100',
        }}
      >
        {children}
      </a>
    </Link>
  );
}

interface VerificationStepProps {
  children: ReactNode;
  isChecked: boolean;
}

function VerificationStep(props: VerificationStepProps): JSX.Element {
  const { isChecked, children } = props;
  return (
    <Flex
      sx={{
        alignItems: 'center',
        textAlign: 'left',
        pointerEvents: isChecked ? 'none' : 'all',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          mr: 'm',
          width: 40,
          height: 40,
          borderRadius: 5,
          backgroundColor: isChecked ? 'black.100' : 'white.100',
          border: '1px solid',
          borderColor: isChecked ? 'black.100' : 'black.10',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: transitions.smooth.fast,
        }}
      >
        {isChecked && <CheckIcon sx={{ width: 24 }} />}
      </Box>
      {children}
    </Flex>
  );
}

const sx = {
  activeUserInfo: {
    px: ['s', null, 'xl'],
    py: 'xl',
    display: 'grid',
    justifyContent: 'space-between',
    gap: 'l',
  },
  leaderboardRow: {
    display: ['block', null, 'flex'],
    alignItems: 'center',
    px: ['s', null, 'xl'],
    py: 'm',
    borderTop: '1px solid',
    borderTopColor: 'black.10',
  },
  userInfoWrapper: {
    position: positionRelative,
    display: 'flex',
    alignItems: 'center',
  },
  avatar: { mr: 's' },
  name: {
    fontWeight: 600,
  },
  username: {
    fontSize: 'xs',
    fontWeight: 600,
  },
  socialLink: {
    ml: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  leaveButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: textAlignRight,
    ml: 'auto',
  },
};

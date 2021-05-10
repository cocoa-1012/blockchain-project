/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid } from 'theme-ui';

import ProfileBio from './ProfileBio';
import UserTagInvitedBy from 'components/users/UserTagInvitedBy';
import ProfileSocialLinks from './ProfileSocialLinks';
import ProfileSocialLinksVerified from './ProfileSocialLinksVerified';
import ProfileSectionHeading from './ProfileSectionHeading';
import ProfileJoinedDate from './ProfileJoinedDate';
import PopoverOverflow from 'components/popover/PopoverOverflow';
import ProfileUpvote from './ProfileUpvote';
import ENSNamePill from './ENSNamePill';

import { notEmptyOrNil } from 'utils/helpers';
import { getHasSocialHandles } from 'utils/creator';
import { areKeysEqual, isOnWaitlist } from 'utils/users';

import { SocialLinkType, SocialLinkVerifiedMap } from 'types/SocialLink';
import { AccountExtended } from 'types/Account';
import SocialVerification from 'types/SocialVerification';
import WalletUser from 'types/WalletUser';

interface ProfileAboutBlockProps {
  user: AccountExtended;
  currentUser: WalletUser;
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
  className?: string;
  ensRegistration: string;
}

export default function ProfileAboutBlock(
  props: ProfileAboutBlockProps
): JSX.Element {
  const {
    user,
    twitterSocialVerification,
    instagramSocialVerification,
    className,
    currentUser,
    ensRegistration,
  } = props;

  const hasBio = notEmptyOrNil(user?.bio);

  const hasSocialLinks = getHasSocialHandles(user?.links);

  const isUserOnWaitlist = isOnWaitlist(user);

  const isWaitlistVisible = isUserOnWaitlist && !user?.isApprovedCreator;

  return (
    <Box className={className}>
      <Grid gap="xl">
        <SocialVerificationBlock
          twitterSocialVerification={twitterSocialVerification}
          instagramSocialVerification={instagramSocialVerification}
          user={user}
          currentUser={currentUser}
          ensName={ensRegistration}
        />

        {hasBio && (
          <Box>
            <ProfileSectionHeading>Bio</ProfileSectionHeading>
            <ProfileBio bio={user?.bio} />
          </Box>
        )}

        {isWaitlistVisible && (
          <ProfileUpvote user={user} currentUser={currentUser} />
        )}

        {hasSocialLinks && (
          <Box>
            <ProfileSectionHeading>Links</ProfileSectionHeading>
            <ProfileSocialLinks socialLinks={user?.links} />
          </Box>
        )}

        <ProfileJoinedDate dateJoined={user?.createdAt} />

        <PopoverOverflow showInvites />
      </Grid>
    </Box>
  );
}

export function ProfileAboutBlockMobile(
  props: ProfileAboutBlockProps
): JSX.Element {
  const {
    user,
    currentUser,
    twitterSocialVerification,
    instagramSocialVerification,
    className,
    ensRegistration,
  } = props;

  const hasBio = notEmptyOrNil(user?.bio);

  const hasSocialLinks = getHasSocialHandles(user?.links);

  const isUserOnWaitlist = isOnWaitlist(user);

  const isWaitlistVisible = isUserOnWaitlist && !user?.isApprovedCreator;

  return (
    <Box className={className}>
      <Grid gap="m">
        {hasBio && (
          <Box>
            <ProfileSectionHeading>Bio</ProfileSectionHeading>
            <ProfileBio bio={user?.bio} />
          </Box>
        )}

        <SocialVerificationBlock
          twitterSocialVerification={twitterSocialVerification}
          instagramSocialVerification={instagramSocialVerification}
          user={user}
          currentUser={currentUser}
          ensName={ensRegistration}
        />

        {isWaitlistVisible && (
          <ProfileUpvote user={user} currentUser={currentUser} />
        )}

        {hasSocialLinks && (
          <Grid>
            <ProfileSectionHeading>Links</ProfileSectionHeading>
            <ProfileSocialLinks socialLinks={user?.links} />
          </Grid>
        )}

        <ProfileJoinedDate dateJoined={user?.createdAt} />

        <PopoverOverflow showInvites />
      </Grid>
    </Box>
  );
}

interface SocialVerificationBlockProps {
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
  user: AccountExtended;
  currentUser: WalletUser;
  ensName: string;
}

function SocialVerificationBlock(
  props: SocialVerificationBlockProps
): JSX.Element {
  const {
    user,
    currentUser,
    twitterSocialVerification,
    instagramSocialVerification,
    ensName,
  } = props;

  const publicKey = user?.publicKey;

  const currentUserPublicKey = currentUser?.publicAddress;
  const isMyProfile = areKeysEqual([currentUserPublicKey, publicKey]);

  const bothAreValid =
    twitterSocialVerification?.isValid && instagramSocialVerification?.isValid;
  const justTwitter =
    twitterSocialVerification?.isValid && !instagramSocialVerification?.isValid;
  const justInstagram =
    !twitterSocialVerification?.isValid && instagramSocialVerification?.isValid;

  // Note from @gosseti:
  // In future this could be an array — feels like a more appropriate data type (the same for user.links too
  const socialLinksVerified: SocialLinkVerifiedMap = bothAreValid
    ? {
        twitter: {
          platform: SocialLinkType.twitter,
          handle: twitterSocialVerification?.username,
        },
        instagram: {
          platform: SocialLinkType.instagram,
          handle: instagramSocialVerification?.username,
        },
      }
    : justTwitter
    ? {
        twitter: {
          platform: SocialLinkType.twitter,
          handle: twitterSocialVerification?.username,
        },
      }
    : justInstagram
    ? {
        instagram: {
          platform: SocialLinkType.instagram,
          handle: instagramSocialVerification?.username,
        },
      }
    : {};

  if (
    !ensName &&
    !user?.acceptedInvite &&
    !twitterSocialVerification?.isValid &&
    !instagramSocialVerification?.isValid
  ) {
    return null;
  }

  return (
    <Grid gap="xs" sx={{ justifyContent: 'flex-start' }}>
      {(twitterSocialVerification?.isValid ||
        instagramSocialVerification?.isValid ||
        isMyProfile) && (
        <ProfileSocialLinksVerified
          socialLinks={socialLinksVerified}
          isMyProfile={isMyProfile}
        />
      )}
      {ensName && <ENSNamePill ensName={ensName} />}
      {user?.acceptedInvite && (
        <Box>
          <UserTagInvitedBy invite={user?.acceptedInvite} />
        </Box>
      )}
    </Grid>
  );
}

/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Grid, ThemeUIStyleObject } from 'theme-ui';
import { GetStaticPathsResult } from 'next';
import dynamic from 'next/dynamic';

import { useFollowModalProfile } from 'hooks/use-follow-modal';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import useProfileUser from 'hooks/queries/use-profile-user';

import Page from 'components/Page';
import Body from 'components/Body';

import UserProfileHeader from 'components/profiles/UserProfileHeader';
import ProfileCoverImage from 'components/profiles/ProfileCoverImage';
import ProfileCopyAddress from 'components/profiles/ProfileCopyAddress';
// import PopoverShare from 'components/popover/PopoverShare';

import ProfileAboutBlock, {
  ProfileAboutBlockMobile,
} from 'components/profiles/ProfileAboutBlock';
import renderProfileWarningBlock from 'components/trust-safety/ProfileWarningBlock';
// import CreatorPopoverCard from 'components/cards/creator-popover/CreatorPopoverCard';
import ProfileCollectors from 'components/profiles/ProfileCollectors';
import ProfileCollectionV2 from 'components/profiles/ProfileCollectionV2';
import CollectorsModal from 'components/modals/CollectorsModal';
import AdminToolsModal from 'components/modals/AdminToolsModal';

import { isFlaggedForModeration } from 'utils/moderation';
import {
  buildImgixUrl,
  buildProfileShareImageUrl,
  getUserProfileHero,
} from 'utils/assets';

import {
  areKeysEqual,
  getAvatarByIndex,
  getProfilePageTitle,
} from 'utils/users';

import {
  notEmptyOrNil,
  getFirstValue,
  truncateMetaDescription,
} from 'utils/helpers';

import { setProfileModerationProxy } from 'queries/admin/profile';
import { getProfilePageProps } from 'queries/server/profile-page';

import { PageColorMode } from 'types/page';
import { ReportType } from 'types/Report';
import SocialVerification from 'types/SocialVerification';

import { UserForProfile } from 'queries/hasura/users';

const ModerationBanner = dynamic(
  () => import('components/admin/ModerationBanner')
);

const ChangeStatusAdminModal = dynamic(
  () => import('components/modals/ChangeStatusAdminModal')
);

const GiveInvitesAdminModal = dynamic(
  () => import('components/modals/GiveInvitesAdminModal')
);

const ReportModal = dynamic(() => import('components/modals/ReportModal'));

const ProfileFollowInfo = dynamic(
  () => import('components/profiles/ProfileFollowInfo')
);

export default function UserProfile(props: UserForProfile): JSX.Element {
  const {
    user: initialUser,
    profileExists,
    createdCount,
    ensRegistration,
  } = props;

  console.log({ ensRegistration });

  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { user: currentUser, isLoading: currentUserIsLoading } = useAuthToken();

  const currentUserPublicAddress = currentUser?.publicAddress;
  const authToken = currentUser?.token;

  const profilePublicAddress = initialUser?.publicKey;

  const { data: userData } = useProfileUser(
    { usernameOrPublicKey: profilePublicAddress },
    { initialData: props, refetchOnWindowFocus: false }
  );

  const { data: currentUserData } = useUserByPublicKey({
    publicKey: currentUserPublicAddress,
    refetchOnWindowFocus: false,
  });

  const user = userData?.user;

  const currentUserIsAdmin = currentUserData?.user?.isAdmin ?? false;

  useFollowModalProfile(user?.publicKey);

  const coverImageUrl = getUserProfileHero(user);
  const avatarUrl = buildImgixUrl(user?.profileImageUrl, { w: 350 });
  const hasUsername = notEmptyOrNil(user?.username);

  const openGraphImageUrl: string = buildProfileShareImageUrl(
    coverImageUrl ?? avatarUrl
  );

  const twitterSocialVerificationProfile: SocialVerification = getFirstValue(
    user?.twitSocialVerifs
  );
  const instagramSocialVerificationProfile: SocialVerification = getFirstValue(
    user?.instaSocialVerifs
  );

  const isMyProfile = areKeysEqual([currentUserPublicAddress, user?.publicKey]);

  const moderationStatus = user?.moderationStatus;

  const isModerated = isFlaggedForModeration(moderationStatus);

  if (isModerated && !currentUserIsAdmin && !isMyProfile) {
    return renderProfileWarningBlock(moderationStatus);
  }

  const reviewText = isMyProfile
    ? 'Your profile is under review.'
    : 'This profile is under review.';

  const suspendedText = isMyProfile
    ? 'Your profile has been removed.'
    : 'This profile has been removed.';

  return (
    <>
      {isModerated && (currentUserIsAdmin || isMyProfile) && (
        <ModerationBanner
          status={moderationStatus}
          reviewText={reviewText}
          suspendedText={suspendedText}
          takedownText=""
        />
      )}
      {currentUserIsAdmin && (
        <>
          <AdminToolsModal publicKey={profilePublicAddress} />
          <ChangeStatusAdminModal
            moderationStatus={moderationStatus}
            moderationFrom=""
            currentUserPublicAddress={currentUserPublicAddress}
            authToken={authToken}
            entityId={profilePublicAddress}
            mutation={setProfileModerationProxy}
            dmcaEnabled={false}
          />
          <GiveInvitesAdminModal
            publicAddress={profilePublicAddress}
            token={authToken}
          />
        </>
      )}

      <CollectorsModal
        publicKey={profilePublicAddress}
        currentUserPublicKey={currentUserPublicAddress}
      />
      <ReportModal
        publicAddress={currentUserPublicAddress}
        authToken={authToken}
        id={user?.publicKey}
        type={ReportType.User}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Page
          title={getProfilePageTitle(user)}
          description={truncateMetaDescription(user?.bio)}
          image={openGraphImageUrl}
          headerMode={coverImageUrl ? PageColorMode.dark : PageColorMode.light}
          absolute
        >
          <ProfileCoverImage
            creator={user}
            coverImage={coverImageUrl}
            avatarBackground={getAvatarByIndex(user?.userIndex ?? 0)}
            avatar={avatarUrl}
            meta={
              <Flex
                sx={{
                  display: ['none', null, 'flex'],
                  justifyContent: 'flex-end',
                  position: 'relative',
                  zIndex: 4,
                  transform: 'translateY(-50%)',
                }}
              >
                <ProfileCollectors
                  publicKey={profilePublicAddress}
                  currentUserPublicKey={currentUserPublicAddress}
                  initialData={{
                    pages: [userData.collectors],
                    pageParams: [0],
                  }}
                />
              </Flex>
            }
          />

          <Body sx={bodyStyles}>
            <Box>
              <Flex sx={{ justifyContent: ['center', null, 'flex-start'] }}>
                <ProfileCopyAddress
                  publicKey={user?.publicKey}
                  userIndex={user?.userIndex}
                />
              </Flex>

              <Grid>
                <Grid gap={['m', 'l']}>
                  {hasUsername && <UserProfileHeader user={user} />}
                  <Grid gap={['l', null, 'xl']}>
                    <Grid gap="l">
                      <Flex
                        sx={{
                          display: ['flex', null, 'none'],
                          justifyContent: 'center',
                        }}
                      >
                        <ProfileCollectors
                          publicKey={profilePublicAddress}
                          currentUserPublicKey={currentUserPublicAddress}
                          initialData={{
                            pages: [userData.collectors],
                            pageParams: [0],
                          }}
                        />
                      </Flex>
                      {profileExists && (
                        <ProfileFollowInfo
                          publicKey={user?.publicKey}
                          currentUserPublicKey={currentUserPublicAddress}
                        />
                      )}
                    </Grid>

                    <ProfileAboutBlock
                      user={user}
                      currentUser={currentUser}
                      twitterSocialVerification={
                        twitterSocialVerificationProfile
                      }
                      instagramSocialVerification={
                        instagramSocialVerificationProfile
                      }
                      ensRegistration={ensRegistration}
                      sx={{ display: ['none', null, 'block'] }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <ProfileCollectionV2
                publicKey={profilePublicAddress}
                currentUserPublicKey={currentUserPublicAddress}
                currentUserIsLoading={currentUserIsLoading}
                user={user}
                currentUser={currentUser}
                createdCount={createdCount}
              />
            </Box>

            <ProfileAboutBlockMobile
              user={user}
              currentUser={currentUser}
              twitterSocialVerification={twitterSocialVerificationProfile}
              instagramSocialVerification={instagramSocialVerificationProfile}
              ensRegistration={ensRegistration}
              sx={{ display: ['block', null, 'none'] }}
            />
          </Body>
        </Page>
      </Box>
    </>
  );
}

const bodyStyles: ThemeUIStyleObject = {
  flex: 1,
  display: 'grid',
  gap: ['l', null, null, null, 'xxl'],
  gridTemplateColumns: [
    null,
    null,
    'minmax(280px, 1fr) 3fr',
    null,
    'minmax(350px, 1fr) 3fr',
  ],
};

type PageArgs = { username: string };
type PathProps = GetStaticPathsResult<PageArgs>;

export async function getStaticPaths(): Promise<PathProps> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps = getProfilePageProps;

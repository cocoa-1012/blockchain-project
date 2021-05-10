/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex, Box, Text, ThemeUIStyleObject } from 'theme-ui';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useFollowState from 'hooks/queries/hasura/use-follow-state';
import useAuthToken from 'hooks/queries/use-auth-token';

import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/links/Link';
import GraySquare from 'components/GraySquare';
import FollowsAvatarsConnected from 'components/follows/FollowsAvatarsConnected';
import FollowButtonConnected from 'components/follows/FollowButtonConnected';
import CreatorPopoverFollowCount from './CreatorPopoverFollowCount';

import { areKeysEqual } from 'utils/users';
import {
  getFirstValue,
  getUsernameOrAddress,
  getUsernameOrTruncatedAddress,
  notEmptyOrNil,
  truncateString,
} from 'utils/helpers';

import { CardDimension } from 'types/Card';
import Follow from 'types/Follow';
import CreatorCardHeading from '../creator/CreatorCardHeading';
import CreatorCardSubheading from '../creator/CreatorCardSubheading';

interface CreatorPopoverCardProps {
  publicKey: string;
  isLazyLoaded: boolean;
  className?: string;
}

export default function CreatorPopoverCard(
  props: CreatorPopoverCardProps
): JSX.Element {
  const { publicKey, isLazyLoaded, className } = props;

  const sx = getStyles();

  const { user: walletUser } = useAuthToken();

  const currentUserPublicKey = walletUser?.publicAddress;
  const token = walletUser?.token;

  const isOwnProfile = areKeysEqual([currentUserPublicKey, publicKey]);

  const { data: userData, isLoading: userLoading } = useUserByPublicKey({
    publicKey,
    enabled: isLazyLoaded,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 3600,
  });

  const user = userData?.user;

  const { data: followData, isLoading: followStateLoading } = useFollowState({
    publicKey,
    currentUserPublicKey,
    enabled: isLazyLoaded,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 3600,
  });

  const followerCount = followData?.followerCount?.aggregate?.count ?? 0;
  const followingCount = followData?.followingCount?.aggregate?.count ?? 0;
  const mutualFollowCount =
    followData?.mutualFollowCount?.aggregate?.count ?? 0;

  const hasNoFollowers = followData && followerCount === 0;

  const firstFollow: Follow = getFirstValue(followData?.follows);
  const isFollowing = firstFollow?.isFollowing;

  const hasBio = notEmptyOrNil(user?.bio);

  return (
    <Box sx={sx.container} className={className}>
      <Box sx={{ paddingX: 'l', paddingTop: 'l', paddingBottom: 20 }}>
        <Box sx={{ position: 'relative' }}>
          <Link href={`/${getUsernameOrAddress(user)}`}>
            <a sx={{ textDecoration: 'none', display: 'block' }}>
              <Box sx={{ marginBottom: 'm' }}>
                <CircleAvatar
                  imageUrl={user?.profileImageUrl}
                  userIndex={user?.userIndex}
                  size={72}
                />
              </Box>

              {userLoading ? (
                <CardHeadingSkeleton />
              ) : (
                <Grid gap={5} sx={{ marginBottom: 's' }}>
                  <CreatorCardHeading user={user} />
                  <CreatorCardSubheading user={user} />
                </Grid>
              )}
            </a>
          </Link>

          {!isOwnProfile && (
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
              <FollowButtonConnected
                isFollowing={isFollowing}
                isLoading={followStateLoading}
                publicKey={publicKey}
                currentUserPublicKey={currentUserPublicKey}
                token={token}
                onFollowSuccess={() => void 0}
                size={CardDimension.large}
              />
            </Box>
          )}
        </Box>

        <Grid gap="s">
          {userLoading ? (
            <GraySquare bg="black.5" height={50} width="100%" />
          ) : hasBio ? (
            <Text variant="body.body" sx={{ fontSize: 15 }}>
              {truncateString(120, user?.bio)}
            </Text>
          ) : null}

          {/* keep the component mounted so that the queries can fire
          instead we just hide it when there’s no followers to show */}
          <Flex
            sx={{
              alignItems: 'center',
              display: hasNoFollowers ? 'none' : 'flex',
            }}
          >
            <Text variant="h.body" sx={{ marginRight: 'xs' }}>
              Followed by
            </Text>
            <FollowsAvatarsConnected
              publicKey={publicKey}
              currentUserPublicKey={currentUserPublicKey}
              hasMutualFollows={mutualFollowCount > 0}
              queriesEnabled={isLazyLoaded}
              isInteractive={false}
            />
          </Flex>
        </Grid>
      </Box>
      <Flex sx={sx.footer}>
        <CreatorPopoverFollowCount
          user={user}
          isLoading={followStateLoading}
          count={followingCount}
          label="Following"
          sx={{ marginRight: 's' }}
        />

        <CreatorPopoverFollowCount
          user={user}
          isLoading={followStateLoading}
          count={followerCount}
          label="Followers"
        />
      </Flex>
    </Box>
  );
}

function CardHeadingSkeleton(): JSX.Element {
  return (
    <Grid gap={5} sx={{ marginBottom: 's' }}>
      <GraySquare height={39} width={200} bg="black.5" />
      <GraySquare height={26} width={160} />
    </Grid>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    boxShadow: 'l',
    backgroundColor: 'white.100',
    minWidth: 340,
    maxWidth: 340,
    borderRadius: 10,
    color: 'black.100',
  };
  const footer: ThemeUIStyleObject = {
    paddingTop: 20,
    paddingBottom: 'm',
    paddingX: 'l',
    borderTop: 'solid 1px',
    borderColor: 'black.5',
  };
  return { container, footer };
};

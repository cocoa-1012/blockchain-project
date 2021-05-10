/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Button } from 'theme-ui';
import { useCallback, useEffect, useState } from 'react';

import { getFirstValue } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import { getButtonStyles } from './styles';

import SpinnerStroked from 'components/SpinnerStroked';
import ProfileEditLink from './ProfileEditLink';
import ProfileFollowCount from './ProfileFollowCount';
import FollowButtonConnected from 'components/follows/FollowButtonConnected';

import useAuthToken from 'hooks/queries/use-auth-token';
import useFollowCountDimensions from 'hooks/use-follow-count-dimensions';
import useFollowModal from 'hooks/use-follow-modal';
import { FollowStateData } from 'hooks/queries/hasura/types';
import useModal from 'hooks/use-modal';

import { ModalMode, ModalKey } from 'types/modal';
import { CardDimension } from 'types/Card';
import Follow from 'types/Follow';

interface ProfileFollowStateProps {
  publicKey: string;
  currentUserPublicKey: string;
  followState: FollowStateData;
  followStateLoading: boolean;
}

export default function ProfileFollowState(
  props: ProfileFollowStateProps
): JSX.Element {
  const {
    publicKey,
    currentUserPublicKey,
    followState,
    followStateLoading,
  } = props;

  const { user: userAuthToken, isLoading: isUserLoading } = useAuthToken();

  const token = userAuthToken?.token;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userFollowState: Follow = getFirstValue(followState?.follows);

  useEffect(() => {
    setIsLoading(false);
  }, [followState]);

  // TODO: wire up the follower count
  const followerCount = followState?.followerCount?.aggregate?.count ?? 0;
  const followingCount = followState?.followingCount?.aggregate?.count ?? 0;

  const isStateLoading = followStateLoading || isLoading || isUserLoading;

  const followCountLoading = followStateLoading || isUserLoading;

  const [measureRef, { size: cardWidthEnum }] = useFollowCountDimensions();

  const isSmall = cardWidthEnum === CardDimension.small;

  const { toggleModal } = useFollowModal(publicKey);

  return (
    <>
      <Flex sx={{ alignItems: 'center' }} ref={measureRef}>
        <Box
          sx={{ marginRight: isSmall ? 's' : 'm', cursor: 'pointer' }}
          onClick={() => toggleModal(ModalMode.Following)}
        >
          <ProfileFollowCount
            label="Following"
            isLoading={followCountLoading}
            followerCount={followingCount}
            size={cardWidthEnum}
          />
        </Box>
        <Box
          sx={{ marginRight: isSmall ? 's' : 'm', cursor: 'pointer' }}
          onClick={() => toggleModal(ModalMode.Followers)}
        >
          <ProfileFollowCount
            label="Followers"
            isLoading={followCountLoading}
            followerCount={followerCount}
            size={cardWidthEnum}
          />
        </Box>
        <FollowButtonConnected
          isLoading={isStateLoading}
          isFollowing={userFollowState?.isFollowing}
          publicKey={publicKey}
          currentUserPublicKey={currentUserPublicKey}
          token={token}
          onFollowSuccess={() => void 0}
          size={cardWidthEnum}
        />
      </Flex>
    </>
  );
}

interface RenderProfileFollowButtonProps {
  isLoading: boolean;
  isFollowing: boolean;
  isHovering: boolean;
  followUser: () => void;
  unfollowUser: () => void;
  currentUserPublicKey: string;
  publicKey: string;
  size: CardDimension;
  isDark: boolean;
}

export function RenderProfileFollowButton(
  props: RenderProfileFollowButtonProps
): JSX.Element {
  const {
    isLoading,
    isFollowing,
    isHovering,
    followUser,
    unfollowUser,
    currentUserPublicKey,
    publicKey,
    size,
    isDark,
  } = props;

  const sx = getButtonStyles(size);

  const isMyProfile = areKeysEqual([currentUserPublicKey, publicKey]);

  if (!currentUserPublicKey) {
    return <ProfileFollowButtonConnect size={size} isDark={isDark} />;
  }

  if (isMyProfile) {
    return <ProfileEditLink size={size} />;
  }

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        sx={{
          pointerEvents: 'none',
          ...sx.button,
        }}
      >
        <Flex sx={{ justifyContent: 'center' }}>
          <SpinnerStroked size={22} />
        </Flex>
      </Button>
    );
  }

  if (isFollowing) {
    return isHovering ? (
      <Button variant="warning" onClick={unfollowUser} sx={sx.warningButton}>
        Unfollow
      </Button>
    ) : (
      <Button
        variant="ghost"
        onClick={unfollowUser}
        sx={{
          ...sx.button,
          backgroundColor: isDark ? 'white.100' : 'black.100',
          color: isDark ? 'black.100' : 'white.100',
          borderColor: isDark ? 'white.100' : 'black.100',
        }}
      >
        Following
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => followUser()}
      sx={isDark ? sx.darkButton : sx.button}
    >
      Follow
    </Button>
  );
}

interface ProfileFollowButtonConnectProps {
  size: CardDimension;
  isDark: boolean;
}

export function ProfileFollowButtonConnect(
  props: ProfileFollowButtonConnectProps
): JSX.Element {
  const { size, isDark } = props;

  const { setCurrentModal } = useModal();

  const sx = getButtonStyles(size);

  const openModal = useCallback(() => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  }, [setCurrentModal]);

  return (
    <Button
      variant="ghost"
      onClick={openModal}
      sx={isDark ? sx.darkButton : sx.button}
    >
      Follow
    </Button>
  );
}

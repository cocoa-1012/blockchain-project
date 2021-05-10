/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { useRef } from 'react';
import { useHoverDirty } from 'react-use';
import { useQueryClient } from 'react-query';

import useCreateFollow from 'hooks/mutations/server/use-create-follow';
import useRemoveFollow from 'hooks/mutations/server/use-remove-follow';

import { CardDimension } from 'types/Card';

import { RenderProfileFollowButton } from 'components/profiles/ProfileFollowState';
import { QueryCacheKey } from 'types/Queries';

interface FollowButtonConnectedProps {
  publicKey: string;
  currentUserPublicKey: string;
  token: string;
  isFollowing: boolean;
  isLoading: boolean;
  size?: CardDimension;
  onFollowSuccess: () => void;
  isDark?: boolean;
}

export default function FollowButtonConnected(
  props: FollowButtonConnectedProps
): JSX.Element {
  const {
    publicKey,
    currentUserPublicKey,
    token,
    isLoading,
    isFollowing,
    size,
    onFollowSuccess,
    isDark = false,
  } = props;

  const queryClient = useQueryClient();

  const onCompleted = () => {
    onFollowSuccess();
    queryClient.invalidateQueries(QueryCacheKey.FollowState);
  };

  const hoverRef = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(hoverRef);

  const [followUser, { loading: followUserLoading }] = useCreateFollow({
    publicKey,
    token,
    onCompleted,
  });

  const [unfollowUser, { loading: unfollowUserLoading }] = useRemoveFollow({
    publicKey,
    token,
    onCompleted,
  });

  return (
    <Flex ref={hoverRef}>
      <RenderProfileFollowButton
        isFollowing={isFollowing}
        isLoading={isLoading || followUserLoading || unfollowUserLoading}
        isHovering={isHovering}
        followUser={followUser}
        unfollowUser={unfollowUser}
        size={size}
        publicKey={publicKey}
        currentUserPublicKey={currentUserPublicKey}
        isDark={isDark}
      />
    </Flex>
  );
}

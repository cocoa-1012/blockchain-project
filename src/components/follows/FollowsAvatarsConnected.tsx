/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { F, flatten, isEmpty, take } from 'ramda';

import useMutualFollows from 'hooks/queries/hasura/use-mutual-follows';
import useFollowers from 'hooks/queries/hasura/use-followers';

import UserStack, {
  UserStackSkeleton,
  UserStackInteractive,
} from './UserStack';
import { QueryCacheKey } from 'types/Queries';

const USER_MUTUAL_FOLLOWS = 5;

interface FollowsAvatarsConnectedProps {
  publicKey: string;
  currentUserPublicKey: string;
  hasMutualFollows: boolean;
  queriesEnabled: boolean;
  isInteractive: boolean;
}

export default function FollowsAvatarsConnected(
  props: FollowsAvatarsConnectedProps
): JSX.Element {
  const {
    publicKey,
    currentUserPublicKey,
    hasMutualFollows,
    queriesEnabled,
    isInteractive,
  } = props;

  const showMututalFollows = Boolean(currentUserPublicKey && hasMutualFollows);

  return showMututalFollows ? (
    <FollowAvatarsMututal
      publicKey={publicKey}
      currentUserPublicKey={currentUserPublicKey}
      queriesEnabled={queriesEnabled}
      isInteractive={isInteractive}
    />
  ) : (
    <FollowAvatarsFallback
      publicKey={publicKey}
      queriesEnabled={queriesEnabled}
      isInteractive={isInteractive}
    />
  );
}

interface FollowAvatarsFallbackProps {
  publicKey: string;
  queriesEnabled: boolean;
  isInteractive: boolean;
}

function FollowAvatarsFallback(props: FollowAvatarsFallbackProps): JSX.Element {
  const { publicKey, queriesEnabled, isInteractive } = props;

  const { data, isLoading } = useFollowers({
    publicKey,
    currentUserPublicKey: '',
    perPage: USER_MUTUAL_FOLLOWS,
    enabled: queriesEnabled,
    cacheKey: QueryCacheKey.FallbackFollows,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 3600,
  });

  const userFollows = take(5, flatten(data?.pages ?? [])).map((f) => f.user);

  const hasNoFollows = isEmpty(userFollows);

  if (isLoading) {
    return <UserStackSkeleton />;
  }

  if (hasNoFollows) {
    return null;
  }

  return isInteractive ? (
    <UserStackInteractive users={userFollows} />
  ) : (
    <UserStack users={userFollows} />
  );
}

interface FollowAvatarsMututalProps {
  publicKey: string;
  currentUserPublicKey: string;
  queriesEnabled: boolean;
  isInteractive: boolean;
}

function FollowAvatarsMututal(props: FollowAvatarsMututalProps): JSX.Element {
  const { publicKey, currentUserPublicKey, queriesEnabled, isInteractive } =
    props;

  const { data, isLoading } = useMutualFollows({
    publicKey,
    currentUserPublicKey,
    limit: USER_MUTUAL_FOLLOWS,
    enabled: queriesEnabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 3600,
  });

  const mutualFollows = take(
    USER_MUTUAL_FOLLOWS,
    data?.mutualFollows ?? []
  ).map((f) => f.user);

  const hasNoFollows = isEmpty(mutualFollows);

  if (isLoading) {
    return <UserStackSkeleton />;
  }

  if (hasNoFollows) {
    return null;
  }

  return isInteractive ? (
    <UserStackInteractive users={mutualFollows} />
  ) : (
    <UserStack users={mutualFollows} />
  );
}

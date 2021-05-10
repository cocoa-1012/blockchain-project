/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import useFollowState from 'hooks/queries/hasura/use-follow-state';
import { jsx } from 'theme-ui';

import ProfileFollowState from './ProfileFollowState';
import ProfileMutualFollows from './ProfileMutualFollows';

interface ProfileFollowInfoProps {
  publicKey: string;
  currentUserPublicKey: string;
}

export default function ProfileFollowInfo(
  props: ProfileFollowInfoProps
): JSX.Element {
  const { publicKey, currentUserPublicKey } = props;

  const { data: followData, isLoading: followStateLoading } = useFollowState({
    publicKey,
    currentUserPublicKey,
  });

  return (
    <>
      <ProfileFollowState
        publicKey={publicKey}
        currentUserPublicKey={currentUserPublicKey}
        followState={followData}
        followStateLoading={followStateLoading}
      />
      <ProfileMutualFollows
        publicKey={publicKey}
        currentUserPublicKey={currentUserPublicKey}
        followState={followData}
        followStateLoading={followStateLoading}
      />
    </>
  );
}

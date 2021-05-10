/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Heading, ThemeUIStyleObject } from 'theme-ui';

import InternalLink from 'components/links/InternalLink';
import FollowsAvatarsConnected from 'components/follows/FollowsAvatarsConnected';
import { UserStackSkeleton } from 'components/follows/UserStack';

import useFollowModal from 'hooks/use-follow-modal';

import { FollowStateData } from 'hooks/queries/hasura/types';
import { ModalMode } from 'types/modal';

interface ProfileMutualFollowsProps {
  currentUserPublicKey: string;
  publicKey: string;
  followState: FollowStateData;
  followStateLoading: boolean;
}

export default function ProfileMutualFollows(
  props: ProfileMutualFollowsProps
): JSX.Element {
  const {
    currentUserPublicKey,
    publicKey,
    followState,
    followStateLoading,
  } = props;

  const sx = getStyles();

  const { toggleModal } = useFollowModal(publicKey);

  const followerCount = followState?.followerCount?.aggregate?.count;
  const hasFollowers = followerCount > 0;
  const mutualFollowCount =
    followState?.mutualFollowCount?.aggregate?.count ?? 0;

  if (!hasFollowers && followState) {
    return null;
  }

  return (
    <Box>
      <Heading variant="h.xs">Followed by</Heading>
      <Flex sx={sx.container}>
        <Box sx={{ display: followStateLoading ? 'block' : 'none' }}>
          <UserStackSkeleton />
        </Box>
        <Box sx={{ display: followStateLoading ? 'none' : 'block' }}>
          <FollowsAvatarsConnected
            publicKey={publicKey}
            currentUserPublicKey={currentUserPublicKey}
            hasMutualFollows={mutualFollowCount > 0}
            isInteractive={true}
            queriesEnabled={true}
          />
        </Box>
      </Flex>
      <Flex>
        <InternalLink
          variant="h.xs"
          onClick={() => toggleModal(ModalMode.Followers)}
        >
          View all
        </InternalLink>
      </Flex>
    </Box>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = { paddingTop: 's', paddingBottom: 20 };
  const avatar: ThemeUIStyleObject = {
    border: 'solid 3px',
    borderColor: 'white.100',
    marginRight: -8,
    borderRadius: 999,
  };
  return { avatar, container };
};

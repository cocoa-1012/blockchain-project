/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, ThemeUIStyleObject } from 'theme-ui';
import { memo, useEffect, useRef } from 'react';
import { useHoverDirty } from 'react-use';

import ProfileFollowCount from 'components/profiles/ProfileFollowCount';
import FollowButtonConnected from 'components/follows/FollowButtonConnected';
import { useCardContext } from '../CardContext';

import { AccountFeed } from 'types/Account';
import { CardDimension } from 'types/Card';
import { ModalMode } from 'types/modal';

import { getFirstValue } from 'utils/helpers';

import useAuthToken from 'hooks/queries/use-auth-token';
import useFollowModal from 'hooks/use-follow-modal';

interface CreatorCardFollowStateProps {
  publicKey: string;
  followState: AccountFeed;
  followsCount: number;
  onCompleted: () => void;
}

export default memo(CreatorCardFollowState);

function CreatorCardFollowState(
  props: CreatorCardFollowStateProps
): JSX.Element {
  const { publicKey, followState, onCompleted } = props;

  const { user } = useAuthToken();

  const token = user?.token;
  const currentUserAddress = user?.publicAddress;

  const sx = getStyles();

  const { setIsHovered } = useCardContext();

  const isFollowing = Boolean(getFirstValue(followState?.follows));
  const followerCount = followState?.followerCount?.aggregate?.count;

  const hoverRef = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(hoverRef);

  useEffect(() => {
    setIsHovered(isHovering);
  }, [isHovering, setIsHovered]);

  const { toggleModal } = useFollowModal(publicKey);

  return (
    <Flex sx={sx.container} ref={hoverRef}>
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() => toggleModal(ModalMode.Followers)}
      >
        <ProfileFollowCount
          isLoading={false}
          followerCount={followerCount}
          label="Followers"
          size={CardDimension.large}
        />
      </Box>

      <FollowButtonConnected
        isFollowing={isFollowing}
        isLoading={false}
        publicKey={publicKey}
        currentUserPublicKey={currentUserAddress}
        token={token}
        onFollowSuccess={onCompleted}
        size={CardDimension.large}
      />
    </Flex>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    marginTop: 'auto',
    paddingX: 'm',
    paddingY: 'm',
    borderTop: 'solid 1px',
    borderColor: 'black.5',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  };
  return { container };
};

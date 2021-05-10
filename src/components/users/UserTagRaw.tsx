/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';

import CircleAvatar from 'components/avatars/CircleAvatar';
import UserTagRawSkeleton from './UserTagSkeleton';
import UserTagContainer from './UserTagContainer';

import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { buildAvatarUrlNew } from 'utils/assets';
import { maybeLowerCase } from 'utils/case';

import Account, { PolymorphicAccount } from 'types/Account';
import { positionRelative } from 'types/styles';

interface UserTagProps {
  user: PolymorphicAccount;
  className?: string;
  isLoading?: boolean;
  avatarSize?: number[];
  color?: string;
}

export default function UserTagRaw(props: UserTagProps): JSX.Element {
  const {
    user,
    className,
    isLoading,
    avatarSize = [24, 34],
    color = 'black.100',
  } = props;

  const usernameOrAddress = getUsernameOrTruncatedAddress(user);

  const hasClaimedUsername = hasUsername(user);

  const avatarUrl = user?.profileImageUrl;

  if (isLoading) {
    return <UserTagRawSkeleton className={className} />;
  }

  return (
    <UserTagContainer className={className}>
      <CircleAvatar
        size={avatarSize}
        userIndex={user?.userIndex}
        imageUrl={avatarUrl}
      />
      <Text sx={{ ...sx.text }}>
        <Text
          ml="xs"
          sx={sx.username}
          color={color}
          variant={hasClaimedUsername ? 'h.body' : 'mono.body'}
          className="username-tag"
        >
          {maybeLowerCase(usernameOrAddress)}
        </Text>
      </Text>
    </UserTagContainer>
  );
}

const sx = {
  text: {
    display: 'flex',
  },
  username: {
    textDecoration: 'none',
    position: positionRelative,
    top: -2,
    fontSize: ['sub', 'body'],
  },
};

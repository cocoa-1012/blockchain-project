/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, ThemeUIStyleObject } from 'theme-ui';

import GraySquare from 'components/GraySquare';
import FollowPopover from './FollowPopover';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/links/Link';

import { getUsernameOrAddress } from 'utils/helpers';

interface SingleUserStackElement {
  userIndex?: number;
  publicKey?: string;
  profileImageUrl?: string;
}

interface UserStackProps<T> {
  users: T[];
}

interface UserStackElementProps<T> {
  user: T;
}

export default function UserStack<T extends SingleUserStackElement>(
  props: UserStackProps<T>
): JSX.Element {
  const { users } = props;

  return (
    <Flex>
      {users.map((user) => (
        <UserStackElement key={user.publicKey} user={user} />
      ))}
    </Flex>
  );
}

export function UserStackInteractive<T extends SingleUserStackElement>(
  props: UserStackProps<T>
): JSX.Element {
  const { users } = props;

  return (
    <Flex>
      {users.map((user) => (
        <FollowPopover key={user.publicKey} publicKey={user.publicKey}>
          <UserStackElement user={user} />
        </FollowPopover>
      ))}
    </Flex>
  );
}

function UserStackElement<T extends SingleUserStackElement>(
  props: UserStackElementProps<T>
): JSX.Element {
  const { user } = props;
  const sx = getStyles();
  return (
    <Link href={`/${getUsernameOrAddress(user)}`}>
      <a>
        <CircleAvatar
          userIndex={user.userIndex}
          imageUrl={user.profileImageUrl}
          sx={sx.avatar}
        />
      </a>
    </Link>
  );
}

export function UserStackSkeleton(): JSX.Element {
  const sx = getStyles();
  return (
    <Flex>
      {[...Array(5)].map((_, index) => (
        <GraySquare width={32} height={32} key={index} sx={sx.avatar} />
      ))}
    </Flex>
  );
}

const getStyles = () => {
  const avatar: ThemeUIStyleObject = {
    border: 'solid 3px',
    borderColor: 'white.100',
    marginRight: -8,
    borderRadius: 999,
  };
  return { avatar };
};

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/links/Link';
import FollowPopover from 'components/follows/FollowPopover';

import { getUsernameOrAddress } from 'utils/helpers';

import Account from 'types/Account';

interface HistoryEventAvatarProps {
  user: Account;
  className?: string;
}

export default function HistoryEventAvatar(
  props: HistoryEventAvatarProps
): JSX.Element {
  const { user, className } = props;

  return (
    <FollowPopover
      publicKey={user.publicKey}
      className={className}
      sx={{ marginRight: 's' }}
    >
      <Link href={`/${getUsernameOrAddress(user)}`}>
        <a sx={{ textDecoration: 'none', display: 'block' }}>
          <CircleAvatar
            sx={{ position: 'relative' }}
            userIndex={user.userIndex}
            imageUrl={user.profileImageUrl}
            size={36}
          />
        </a>
      </Link>
    </FollowPopover>
  );
}

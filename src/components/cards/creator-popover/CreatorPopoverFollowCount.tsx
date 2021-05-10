/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import Link from 'components/links/Link';
import ProfileFollowCount from 'components/profiles/ProfileFollowCount';

import { getUsernameOrAddress } from 'utils/helpers';

import { CardDimension } from 'types/Card';
import Account from 'types/Account';

interface CreatorPopoverFollowCountProps {
  user: Account;
  isLoading: boolean;
  count: number;
  label: string;
  className?: string;
}

export default function CreatorPopoverFollowCount(
  props: CreatorPopoverFollowCountProps
): JSX.Element {
  const { user, isLoading, count, className, label } = props;
  return (
    <Link
      href={{
        pathname: `/${getUsernameOrAddress(user)}`,
        query: { follows: true },
      }}
    >
      <a
        className={className}
        sx={{ marginRight: 's', cursor: 'pointer', textDecoration: 'none' }}
      >
        <ProfileFollowCount
          label={label}
          isLoading={isLoading}
          followerCount={count}
          size={CardDimension.small}
        />
      </a>
    </Link>
  );
}

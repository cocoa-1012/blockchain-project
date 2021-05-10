/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import { useUsernameByPublicKey } from 'hooks/queries/use-user-by-public-key';

import UserTag from './UserTag';
import Account from 'types/Account';

interface UserTagProps {
  publicKey: string;
  className?: string;
}

export default function UserTagDynamic(props: UserTagProps): JSX.Element {
  const { publicKey, className } = props;

  const { data, isLoading } = useUsernameByPublicKey({
    publicKey,
    refetchOnWindowFocus: false,
  });

  const fallbackUser: Account = { publicKey };

  return (
    <UserTag
      user={data?.user ?? fallbackUser}
      className={className}
      isLoading={isLoading}
    />
  );
}

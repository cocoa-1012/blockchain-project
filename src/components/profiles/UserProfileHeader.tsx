/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, Box } from 'theme-ui';

import GradientUsername from './GradientUsername';
import CreatorName from 'components/creators/CreatorName';

import { notEmptyOrNil } from 'utils/helpers';
import { getUserFullName } from 'utils/users';
import { getSymbolFromCreator } from 'utils/creator';

import Account from 'types/Account';

interface UserProfileHeaderProps {
  user: Account;
}

export default function UserProfileHeader(
  props: UserProfileHeaderProps
): JSX.Element {
  const { user } = props;

  const userFullName = getUserFullName(user);
  const hasFullName = notEmptyOrNil(userFullName);
  const username = `@${getSymbolFromCreator(user)}`;

  return (
    <Flex
      sx={{
        alignItems: ['center', null, 'flex-start'],
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ maxWidth: '100%' }}>
        <Text variant={!hasFullName ? 'gradient' : null}>
          <CreatorName>{hasFullName ? userFullName : username}</CreatorName>
        </Text>
      </Flex>

      {hasFullName && <GradientUsername>{username}</GradientUsername>}
    </Flex>
  );
}

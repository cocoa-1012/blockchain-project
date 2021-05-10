/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';

import { positionRelative } from 'types/styles';
import UserTagContainer from './UserTagContainer';

interface UserTagRawSkeletonProps {
  className?: string;
}

export default function UserTagRawSkeleton(
  props: UserTagRawSkeletonProps
): JSX.Element {
  const { className } = props;
  return (
    <UserTagContainer className={className}>
      <Box sx={sx.avatar} />
      <Text sx={sx.text}>
        <Text ml="xs" sx={sx.username} />
      </Text>
    </UserTagContainer>
  );
}

export function UserTagRawSkeletonReversed(
  props: UserTagRawSkeletonProps
): JSX.Element {
  const { className } = props;
  return (
    <UserTagContainer className={className}>
      <Text sx={sx.text}>
        <Text mr="xs" sx={sx.username} />
      </Text>
      <Box sx={sx.avatar} />
    </UserTagContainer>
  );
}

const sx = {
  avatar: {
    backgroundColor: 'black.10',
    width: [24, 34],
    height: [24, 34],
    borderRadius: 999,
  },
  text: {
    display: 'flex',
  },
  username: {
    textDecoration: 'none',
    color: 'black.100',
    position: positionRelative,
    top: -1,
    fontSize: ['sub', 'body'],
    backgroundColor: 'black.5',
    width: 120,
    height: 20,
  },
};

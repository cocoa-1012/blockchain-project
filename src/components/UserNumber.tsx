/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { ReactNode } from 'react';
import { jsx, Text, Flex } from 'theme-ui';
import { padNumber } from 'utils/helpers';

interface UserNumberProps {
  userNumber: number;
}

export default function UserNumber(props: UserNumberProps): JSX.Element {
  const { userNumber } = props;
  return <UserTag>#{padNumber(userNumber)}</UserTag>;
}

export function CreatorTag(): JSX.Element {
  return <UserTag>Creator</UserTag>;
}

interface UserTagProps {
  children: ReactNode;
}

export function UserTag(props: UserTagProps): JSX.Element {
  const { children } = props;
  return (
    <Text
      sx={{
        fontSize: [12, null, 'sub'],
        paddingX: [12, 's'],
        paddingY: [7, 9],
        backgroundColor: 'black.100',
        color: 'white.100',
        letterSpacing: 1,
        borderRadius: 999,
        textTransform: 'uppercase',
      }}
      variant="mono.sub"
    >
      {children}
    </Text>
  );
}

interface TagWrapperProps {
  children: ReactNode;
}

export function TagWrapper(props: TagWrapperProps): JSX.Element {
  const { children } = props;
  return <Flex sx={{ marginBottom: ['s', null, 'm'] }}>{children}</Flex>;
}

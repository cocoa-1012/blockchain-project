/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

interface ProfileSectionHeadingProps {
  children: ReactNode;
}

export default function ProfileSectionHeading(
  props: ProfileSectionHeadingProps
): JSX.Element {
  const { children } = props;
  return (
    <Text
      variant="h.xs"
      sx={{
        borderBottom: 'solid 1px',
        borderColor: 'black.10',
        paddingBottom: 's',
        lineHeight: 1,
        marginBottom: 's',
      }}
    >
      {children}
    </Text>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { ReactNode } from 'react';
import { jsx, Text } from 'theme-ui';

interface GradientUsernameProps {
  children: ReactNode;
}

export default function GradientUsername(
  props: GradientUsernameProps
): JSX.Element {
  const { children } = props;
  return (
    <Text
      sx={{
        display: 'flex',
        fontFamily: 'body',
        fontWeight: 600,
        fontSize: ['xs', 's', null, null, 'm'],
        letterSpacing: ['-0.015em', '-0.035em'],
        maxWidth: '100%',
      }}
    >
      <Text
        variant="gradient"
        sx={{ lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {children}
      </Text>
    </Text>
  );
}

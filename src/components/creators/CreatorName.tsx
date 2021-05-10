/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

interface CreatorNameProps {
  children: ReactNode;
}

export default function CreatorName(props: CreatorNameProps): JSX.Element {
  const { children } = props;
  return (
    <Text
      sx={{
        fontFamily: 'body',
        fontWeight: 600,
        letterSpacing: ['-0.05em'],
        marginBottom: [5, 'xs', 's'],
        fontSize: ['m', null, null, null, 'l'],
        lineHeight: 1.1,
        overflowX: 'clip',
        textOverflow: 'ellipsis',
      }}
    >
      {children}
    </Text>
  );
}

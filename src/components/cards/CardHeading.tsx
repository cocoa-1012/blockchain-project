/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';

import { ReactNode } from 'react';

interface CardHeadingProps {
  children: ReactNode;
  className?: string;
}

export default function CardHeading(props: CardHeadingProps): JSX.Element {
  const { children, className } = props;
  return (
    <Text
      sx={{
        letterSpacing: '-0.03em',
        fontSize: 32,
        lineHeight: 'heading',
        fontFamily: 'body',
        fontWeight: 'heading',
        color: 'black.100',
      }}
      className={className}
    >
      {children}
    </Text>
  );
}

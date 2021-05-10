/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading } from 'theme-ui';
import { ReactNode } from 'react';

interface FormHeadingProps {
  children: ReactNode;
}

export default function FormHeading(props: FormHeadingProps): JSX.Element {
  const { children } = props;
  return (
    <Heading
      sx={{
        maxWidth: 740,
        textAlign: 'center',
        mx: 'auto',
        pt: [0, 'l', 'xxl', 'xxxl'],
        fontSize: ['m', 'l', 'xl'],
        fontFamily: 'body',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      }}
    >
      {children}
    </Heading>
  );
}

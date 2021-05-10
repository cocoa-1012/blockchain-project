/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading } from 'theme-ui';

export default function AuthHeading(props): JSX.Element {
  const { variant = 'h.s', children, className } = props;
  return (
    <Heading
      className={className}
      variant={variant}
      sx={{
        maxWidth: 320,
        textAlign: 'center',
        marginX: 'auto',
        marginBottom: 'l',
      }}
    >
      {children}
    </Heading>
  );
}

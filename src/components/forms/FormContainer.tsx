/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer(props: FormContainerProps): JSX.Element {
  const { children } = props;
  return (
    <Box
      sx={{
        display: 'block',
        py: ['m', null, 'l', 'xl'],
        px: ['m', 'l', 'xl'],
        boxShadow: 's',
        bg: 'white.100',
        maxWidth: 740,
        mx: [null, null, 'auto'],
        width: [null, null, '100%'],
        borderRadius: 15,
        textDecoration: 'none',
        color: 'black.100',
      }}
    >
      {children}
    </Box>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

import { ReactNode } from 'react';

interface UserTagContainerProps {
  children: ReactNode;
  className?: string;
}

export default function UserTagContainer(
  props: UserTagContainerProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Box
      sx={{
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
      className={className}
    >
      {children}
    </Box>
  );
}

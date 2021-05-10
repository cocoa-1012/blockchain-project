/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Button } from 'theme-ui';
import { ReactNode } from 'react';

interface DisabledButtonProps {
  children: ReactNode;
  className?: string;
}

export default function DisabledButton(
  props: DisabledButtonProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Button
      className={className}
      sx={{ width: '100%', color: 'black.100', bg: 'black.10' }}
      disabled
    >
      {children}
    </Button>
  );
}

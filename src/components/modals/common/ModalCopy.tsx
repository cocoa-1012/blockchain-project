/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { ReactNode } from 'react';
import { jsx, Text } from 'theme-ui';

interface ModalCopyProps {
  children: ReactNode;
  className?: string;
}

export default function ModalCopy({
  children,
  className,
}: ModalCopyProps): JSX.Element {
  return (
    <Text
      variant="body.body"
      sx={{
        textAlign: 'center',
        maxWidth: 240,
        marginX: 'auto',
      }}
      className={className}
    >
      {children}
    </Text>
  );
}

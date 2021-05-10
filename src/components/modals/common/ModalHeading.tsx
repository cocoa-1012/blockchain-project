/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { ReactNode } from 'react';
import { jsx, Heading } from 'theme-ui';

interface ModalHeadingProps {
  children: ReactNode;
  className?: string;
}

export default function ModalHeading({
  children,
  className,
}: ModalHeadingProps): JSX.Element {
  return (
    <Heading
      variant="h.s"
      sx={{ textAlign: 'center', marginBottom: 'l', maxWidth: 220, mx: 'auto' }}
      className={className}
    >
      {children}
    </Heading>
  );
}

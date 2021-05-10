/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { ReactNode } from 'react';

import HintText from 'components/forms/fields/HintText';

interface SuccessFieldProps {
  children: ReactNode;
  className?: string;
}

export default function SuccessField(props: SuccessFieldProps): JSX.Element {
  const { children, className } = props;
  return (
    <HintText bg="green.10" color="green.100" className={className}>
      {children}
    </HintText>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Button } from 'theme-ui';
import { useField } from 'formik';
import { ReactNode } from 'react';

import DisabledButton from 'components/forms/transactions/DisabledButton';

interface BidSubmitButtonProps {
  name: string;
  children: ReactNode;
  className?: string;
}

export default function BidSubmitButton(
  props: BidSubmitButtonProps
): JSX.Element {
  const { name, children, className } = props;

  const [, meta] = useField(name);

  if (meta.error) {
    return <DisabledButton>{meta.error}</DisabledButton>;
  }

  return (
    <Button type="submit" className={className} sx={{ width: '100%' }}>
      {children}
    </Button>
  );
}

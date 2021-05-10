/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Button } from 'theme-ui';
import { useField } from 'formik';
import { ReactNode } from 'react';

import DisabledButton from 'components/forms/transactions/DisabledButton';

interface ValidatedSubmitButtonProps {
  name: string;
  children: ReactNode;
  className?: string;
}

export default function ValidatedSubmitButton(
  props: ValidatedSubmitButtonProps
): JSX.Element {
  const { name, children, className } = props;

  const [, meta] = useField(name);

  if (meta.error) {
    return <DisabledButton className={className}>{meta.error}</DisabledButton>;
  }

  return (
    <Button className={className} type="submit">
      {children}
    </Button>
  );
}

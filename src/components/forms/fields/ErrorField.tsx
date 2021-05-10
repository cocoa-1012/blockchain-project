/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import HintText from 'components/forms/fields/HintText';

interface ErrorFieldProps {
  meta: any;
  forceError?: boolean;
  className?: string;
}

export default function ErrorField(props: ErrorFieldProps): JSX.Element {
  const { meta, forceError, className } = props;

  if ((meta.error && meta.touched) || (meta.error && forceError)) {
    return (
      <HintText bg="red.10" color="red.100" className={className}>
        {meta.error}
      </HintText>
    );
  }
  return null;
}

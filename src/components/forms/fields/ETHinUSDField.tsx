/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useField } from 'formik';

import ETHinUSD from 'components/ETHinUSD';

import { notEmptyOrNil } from 'utils/helpers';

interface ETHinUSDFieldProps {
  name: string;
}

export default function ETHinUSDField(props: ETHinUSDFieldProps): JSX.Element {
  const [field] = useField(props);

  const hasValue = notEmptyOrNil(field.value);

  return <ETHinUSD amount={hasValue ? field.value : '0'} />;
}

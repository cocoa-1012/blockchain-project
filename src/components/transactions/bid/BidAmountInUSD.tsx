/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { useField } from 'formik';
import { when, always } from 'ramda';

import ETHinUSD from 'components/ETHinUSD';
import { isEmptyOrNil } from 'utils/helpers';

interface BidAmountInUSDProps {
  name: string;
}

const valueOrEmpty = when(isEmptyOrNil, always('0'));

export default function BidAmountInUSD(
  props: BidAmountInUSDProps
): JSX.Element {
  const [field] = useField(props);

  return (
    <Text sx={{ color: 'black.60' }} variant="h.body">
      <ETHinUSD amount={valueOrEmpty(field.value)} />
    </Text>
  );
}

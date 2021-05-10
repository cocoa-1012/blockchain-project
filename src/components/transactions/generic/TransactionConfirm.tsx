/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import TransactionContainer from '../TransactionContainer';
import TransactionAwaitingConfirmation from 'components/transactions/TransactionAwaitingConfirmation';

import { TransactionProps } from './types';

export default function TransactionConfirm(
  props: TransactionProps
): JSX.Element {
  const { artwork } = props;
  return (
    <TransactionContainer artwork={artwork}>
      <TransactionAwaitingConfirmation />
    </TransactionContainer>
  );
}

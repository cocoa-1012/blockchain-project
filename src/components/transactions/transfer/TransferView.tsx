/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

import { TransferFormValues } from './types';

import TransferForm from 'components/transactions/transfer/TransferForm';
import ValidatedSubmitButton from 'components/forms/ValidatedSubmitButton';
import WalletAddressField from 'components/forms/WalletAddressField';
import TransactionContent from '../TransactionContent';

interface TransferViewProps {
  onSubmit: (values: TransferFormValues) => void;
}

export default function TransferView(props: TransferViewProps): JSX.Element {
  const { onSubmit } = props;

  return (
    <TransactionContent
      title="Transfer NFT"
      description="Transfer this NFT to another user or wallet by entering an Ethereum address below."
    >
      <TransferForm
        onSubmit={onSubmit}
        initialValues={{
          to: '',
        }}
      >
        <WalletAddressField name="to" placeholder="0x..." />
        <Box sx={{ marginTop: 'm' }}>
          <ValidatedSubmitButton name="to" sx={{ width: '100%' }}>
            Continue
          </ValidatedSubmitButton>
        </Box>
      </TransferForm>
    </TransactionContent>
  );
}

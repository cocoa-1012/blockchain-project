/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Formik, Form } from 'formik';
import { ReactNode } from 'react';

import { TransferArtworkSchema } from 'schemas/transfer';

import { TransferFormValues } from './types';

interface TransferFormProps {
  onSubmit: (values: TransferFormValues) => void;
  children: ReactNode;
  initialValues: TransferFormValues;
}

export default function TransferForm(props: TransferFormProps): JSX.Element {
  const { onSubmit, children, initialValues } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={TransferArtworkSchema}
    >
      <Form>{children}</Form>
    </Formik>
  );
}

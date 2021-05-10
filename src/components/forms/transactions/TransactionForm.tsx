/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Formik, Form, FormikValues } from 'formik';
import { ReactNode } from 'react';

interface TransactionFormProps {
  children: ReactNode | ReactNode[];
  amount?: string;
  onSubmit: (values: FormikValues) => Promise<void>;
  schema: any;
}

export default function TransactionForm(
  props: TransactionFormProps
): JSX.Element {
  const { amount, onSubmit, children, schema } = props;

  return (
    <Formik
      enableReinitialize
      initialValues={{ amount }}
      onSubmit={onSubmit}
      validationSchema={schema}
    >
      <Form sx={{ width: '100%' }}>{children}</Form>
    </Formik>
  );
}

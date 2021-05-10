/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Formik, Form } from 'formik';
import { ReactNode } from 'react';

import { ListArtworkSchema } from 'schemas/list';

import { SecondaryListFormValues } from './types';

interface ListFormProps {
  onSubmit: (values: SecondaryListFormValues) => void;
  children: ReactNode;
  initialValues: SecondaryListFormValues;
}

export default function ListForm(props: ListFormProps): JSX.Element {
  const { onSubmit, children, initialValues } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={ListArtworkSchema}
    >
      <Form>{children}</Form>
    </Formik>
  );
}

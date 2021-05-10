/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Formik, Form, useField } from 'formik';
import { ReactNode } from 'react';

import { TwitterSchema } from 'schemas/twitter';

import { TwitterFormValues } from './types';

interface TwitterFormProps {
  onSubmit: (values: TwitterFormValues) => void;
  children: ReactNode;
  initialValues: TwitterFormValues;
}

export default function TwitterForm(props: TwitterFormProps): JSX.Element {
  const { onSubmit, children, initialValues } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={TwitterSchema}
      validateOnMount
    >
      <Form>{children}</Form>
    </Formik>
  );
}

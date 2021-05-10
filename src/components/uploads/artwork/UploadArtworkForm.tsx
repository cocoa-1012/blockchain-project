/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Form, Formik } from 'formik';
import { ReactNode } from 'react';

import { UploadArtworkFormValues } from './types';

import { UploadSchema } from 'schemas/upload';

interface UploadArtworkFormProps {
  children: ReactNode;
  onSubmit: (values: UploadArtworkFormValues) => void;
}

export default function UploadArtworkForm(
  props: UploadArtworkFormProps
): JSX.Element {
  const { children, onSubmit } = props;
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ file: null, modelPoster: null }}
      validationSchema={UploadSchema}
      validateOnMount
    >
      <Form>{children}</Form>
    </Formik>
  );
}

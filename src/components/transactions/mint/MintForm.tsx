import { Formik, Form } from 'formik';
import { ReactNode } from 'react';

import { MintArtworkSchema } from 'schemas/mint';

import { MintFormValues } from './types';

interface MintFormProps {
  onSubmit: (values: MintFormValues) => void;
  children: ReactNode;
  initialValues: MintFormValues;
}

export default function MintForm(props: MintFormProps): JSX.Element {
  const { onSubmit, children, initialValues } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={MintArtworkSchema}
    >
      <Form>{children}</Form>
    </Formik>
  );
}

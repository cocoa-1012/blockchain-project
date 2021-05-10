/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Formik } from 'formik';

export default function FormikForm(props) {
  const { children, onSubmit, initialValues } = props;

  async function handleSubmit(values, actions) {
    const { setStatus } = actions;
    try {
      await onSubmit(values, actions);
      setStatus({ formSubmitted: true });
    } catch (err) {
      // handle error
    }
  }

  return (
    <Formik {...props} onSubmit={handleSubmit} initialValues={initialValues}>
      {children}
    </Formik>
  );
}

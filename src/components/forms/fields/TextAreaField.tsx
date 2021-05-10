/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Textarea } from 'theme-ui';
import { useField } from 'formik';
import AutoExpand from 'react-expanding-textarea';

import { notEmptyOrNil } from 'utils/helpers';
import Placeholder from 'components/forms/fields/Placeholder';
import ErrorField from 'components/forms/fields/ErrorField';

interface TextAreaFieldProps {
  className?: string;
  placeholder: string;
  name: string;
  rows?: number;
}

export default function TextAreaField(props: TextAreaFieldProps): JSX.Element {
  const { className, placeholder, name, rows } = props;

  const [field, meta] = useField(name);

  const hasValue = notEmptyOrNil(field.value);

  return (
    <Box sx={{ position: 'relative' }}>
      <Placeholder value={placeholder} visible={hasValue} />
      <Textarea
        {...field}
        rows={rows}
        as={AutoExpand}
        className={className}
        placeholder={placeholder}
        sx={{
          minHeight: '60px !important',
          resize: 'none',
        }}
      />
      <ErrorField meta={meta} />
    </Box>
  );
}

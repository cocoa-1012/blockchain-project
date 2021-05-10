/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Input, Box } from 'theme-ui';
import { useField } from 'formik';

import Placeholder from 'components/forms/fields/Placeholder';
import ErrorField from 'components/forms/fields/ErrorField';

import { getErrorStyles, hasError } from 'utils/styles';
import { notEmpty } from 'utils/helpers';

interface TextFieldProps {
  className?: string;
  placeholder: string;
  name: string;
  type?: string;
  required?: boolean;
}

export default function TextField(props: TextFieldProps): JSX.Element {
  const { className, placeholder, name, type, required } = props;

  const [field, meta, helpers] = useField(name);

  const hasValue = notEmpty(field.value);

  const errorVisible = hasError(meta, false);

  return (
    <Box sx={{ position: 'relative' }}>
      <Placeholder value={placeholder} visible={hasValue} />
      <Input
        {...field}
        className={className}
        placeholder={placeholder}
        required={required}
        type={type}
        sx={{
          paddingTop: hasValue && 15,
          ...getErrorStyles(errorVisible),
        }}
      />
      <ErrorField meta={meta} />
    </Box>
  );
}

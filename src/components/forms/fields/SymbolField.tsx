/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Input, Flex, Box, Text } from 'theme-ui';
import { useField } from 'formik';

import { getErrorStyles, hasError } from 'utils/styles';
import { notEmptyOrNil } from 'utils/helpers';

import Placeholder from 'components/forms/fields/Placeholder';
import ErrorField from 'components/forms/fields/ErrorField';

interface SymbolFieldProps {
  prefix?: string;
  className?: string;
  forceError?: boolean;
  hideError?: boolean;
  placeholder: string;
  name: string;
}

export default function SymbolField(props: SymbolFieldProps): JSX.Element {
  const {
    prefix = '@',
    className,
    forceError,
    hideError,
    placeholder,
    name,
  } = props;

  const [field, meta] = useField(name);

  const hasValue = notEmptyOrNil(field.value);

  const errorVisible = hasError(meta, forceError);

  return (
    <Box>
      <Flex
        sx={{
          alignItems: 'center',
          bg: 'black.5',
          borderRadius: 10,
          border: 'solid 1px',
          borderColor: 'black.10',
        }}
      >
        <Text variant="stnd.xs" px={20} sx={{ color: 'black.50' }}>
          {prefix}
        </Text>

        <Flex sx={{ position: 'relative', flex: 'auto', margin: -1 }}>
          {placeholder && (
            <Placeholder value={placeholder} visible={hasValue} />
          )}

          <Input
            {...field}
            {...props}
            className={className}
            sx={{
              paddingTop: hasValue && placeholder && 15,
              ...getErrorStyles(errorVisible),
            }}
          />
        </Flex>
      </Flex>
      {!hideError && <ErrorField meta={meta} forceError={forceError} />}
    </Box>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Text, Input } from 'theme-ui';
import { useEffect, useState } from 'react';
import { useField } from 'formik';
import { useMeasure } from 'react-use';

import { ValidationStates } from 'components/forms/FieldMeta';
import { notEmpty, truncateAddress } from 'utils/helpers';

interface WalletAddressFieldProps {
  hideValidation?: boolean;
  name: string;
  placeholder: string;
  variant?: string;
}

export default function WalletAddressField(
  props: WalletAddressFieldProps
): JSX.Element {
  const [field, meta, helpers] = useField(props);

  const { hideValidation } = props;

  const { value } = field;
  const { error } = meta;

  const isValid = !!(value.length === 42 && !meta.error);
  const hasError = !!(notEmpty(value) && error);

  const [charRef, { width: charWidth }] = useMeasure();
  const [boxRef, { width: fieldWidth }] = useMeasure();

  const [displayValue, setDisplayValue] = useState(value);

  const onBlur = () => helpers.setTouched(true);

  function handleKeyPress(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      helpers.setValue('');
    }
  }

  useEffect(() => {
    // this is ported over from the existing app
    // TODO: add comments regarding the logic
    const strLength = value?.length ?? 0;
    const maxChars = fieldWidth / charWidth;

    if (strLength >= maxChars) {
      const numberOfChars = Math.round((fieldWidth / charWidth - 5) / 2);

      const truncatedStr = truncateAddress({ address: value, numberOfChars });

      setDisplayValue(truncatedStr);
    } else {
      setDisplayValue(value);
    }
  }, [value, fieldWidth, charWidth]);

  return (
    <Box>
      <Flex
        sx={{
          height: 0,
          opacity: 0,
          paddingLeft: 20,
          paddingRight: hideValidation ? 20 : 64,
        }}
      >
        <Box ref={boxRef} sx={{ width: '100%' }} />
        <Text ref={charRef} variant="mono.sub" sx={{ alignSelf: 'flex-start' }}>
          -
        </Text>
      </Flex>

      <Box sx={{ position: 'relative' }}>
        <Input
          {...props}
          {...field}
          onKeyDown={handleKeyPress}
          onBlur={onBlur}
          value={displayValue}
          variant="address"
        />
        {!hideValidation && (
          <ValidationStates hasError={hasError} isValid={isValid} />
        )}
      </Box>
    </Box>
  );
}

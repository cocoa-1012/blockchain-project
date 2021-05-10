/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { useField } from 'formik';

interface CharacterCounterProps {
  maxLength: number;
  name: string;
  className?: string;
}

export default function CharacterCounter(
  props: CharacterCounterProps
): JSX.Element {
  const [field] = useField(props);
  const { maxLength = 200, className } = props;

  const fieldLength = field?.value?.length ?? 0;

  const lengthExceeded = fieldLength > maxLength;

  return (
    <Text
      className={className}
      variant="stnd.xs"
      sx={{
        fontSize: 10,
        color: lengthExceeded ? 'red' : 'black.50',
        pt: 8,
        textAlign: 'right',
        letterSpacing: '0.025em',
      }}
    >
      {fieldLength}/{maxLength}
    </Text>
  );
}

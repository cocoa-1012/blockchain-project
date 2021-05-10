import { useField } from 'formik';
import { useCallback, useRef, useState } from 'react';

import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import InputBlank from 'components/base/InputBlank';
import { countDecimals } from 'utils/formatters';

const PercentInput = styled(InputBlank, {
  backgroundColor: 'transparent',
  fontSize: '$3',
  textAlign: 'right',
  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
});

const PercentFieldContainer = styled(Flex, {
  alignItems: 'center',
  paddingY: '$1',
  borderRadius: '$2',
  paddingRight: '$3',
  marginRight: '-$3',
  transition: 'background-color $1 $ease',
  boxShadow: 'inset 0 0 0 2px rgba(0, 0, 0, 0)',
  cursor: 'text',
  '&:hover': {
    backgroundColor: '$black5',
  },
  variants: {
    focused: {
      true: {
        boxShadow: 'inset 0 0 0 2px $colors$black100',
        '&:hover': {
          backgroundColor: '$white100',
        },
      },
    },
    error: {
      true: {
        boxShadow: 'inset 0 0 0 2px $colors$red100',
      },
    },
  },
});

interface CurrencyFieldProps {
  name: string;
}

export default function PercentField(props: CurrencyFieldProps): JSX.Element {
  const { name } = props;

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>();

  const [field, meta, helpers] = useField<number>(name);

  const focusInput = useCallback(() => {
    inputRef?.current?.focus();
  }, [inputRef]);

  const handleChange = useCallback(
    (value) => {
      const numberOfDecimals = countDecimals(value);
      if (numberOfDecimals <= 2) {
        helpers.setValue(value);
      }
    },
    [helpers]
  );

  return (
    <PercentFieldContainer
      focused={isFocused}
      error={Boolean(meta.error)}
      onClick={focusInput}
    >
      <Box>
        <PercentInput
          {...field}
          name={name}
          type="number"
          step="0.01"
          inputMode="decimal"
          onChange={(ev) => handleChange(ev.target.value)}
          onWheel={(ev) => ev.currentTarget.blur()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ maxWidth: '5.25ch', paddingRight: 2 }}
          ref={inputRef}
        />
      </Box>

      <Text
        css={{
          fontSize: '$3',
          fontWeight: 600,
          lineHeight: 1,
          marginLeft: 2,
          position: 'relative',
          top: 1,
        }}
      >
        %
      </Text>
    </PercentFieldContainer>
  );
}

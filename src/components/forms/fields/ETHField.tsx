/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import {
  jsx,
  Box,
  Flex,
  Input,
  Text,
  ThemeUIStyleObject,
  StylePropertyValue,
} from 'theme-ui';
import { useField } from 'formik';
import { useMemo } from 'react';

import { transitions } from 'utils/themes/main/theme';

import ETHIcon from 'assets/icons/eth-input-icon.svg';

interface CurrencyFieldProps {
  className?: string;
  name: string;
  autoFocus?: boolean;
  placeholder: string;
}

type PositionProperty = 'absolute' | 'relative' | undefined;
type MozAppearance = 'textfield' | 'none';

export default function ETHField(props: CurrencyFieldProps): JSX.Element {
  const { className, name, autoFocus } = props;

  const [field] = useField(name);

  const sx = useMemo(getStyles, []);
  const containerStyle: ThemeUIStyleObject = sx.container;
  const inputStyle: ThemeUIStyleObject = sx.input;

  return (
    <Box sx={containerStyle}>
      <Flex
        sx={{
          backgroundColor: 'black.100',
          borderRadius: 17,
        }}
      >
        <Box>
          <Input
            {...field}
            {...props}
            type="number"
            className={className}
            sx={inputStyle}
            step="any"
            inputMode="decimal"
            // eslint-disable-next-line
            autoFocus={autoFocus}
            onWheel={(ev) => ev.currentTarget.blur()}
          />
        </Box>

        <Flex
          sx={{
            paddingX: 's',
            alignItems: 'center',
            minWidth: 110,
            flexShrink: 0,
          }}
        >
          <Text
            variant="h.m"
            sx={{
              color: 'white.100',
              position: 'relative',
              top: -2,
              marginRight: 10,
            }}
          >
            ETH
          </Text>
          <ETHIcon
            sx={{ display: 'block', flexShrink: 0 }}
            width={18}
            height={27}
          />
        </Flex>
      </Flex>
    </Box>
  );
}

const positionForContainer: StylePropertyValue<PositionProperty> = 'relative';
const mozAppearance: MozAppearance = 'textfield';
const appearance: 'none' | undefined = 'none';

const getStyles = () => ({
  container: {
    position: positionForContainer,
    fontFamily: 'mono',
    fontSize: 46,
  },
  input: {
    border: 'solid 4px',
    borderColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 16,
    minHeight: 70,
    padding: 0,
    paddingX: 's',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    outline: 'none',
    boxShadow: '0 0 1px #ccc, 0px 10px 20px rgba(0, 0, 0, 0.05)',
    transition: transitions.smooth.fast,
    MozAppearance: mozAppearance,
    '&:focus': {
      boxShadow: 'm',
      borderColor: 'black.100',
    },
    '&::placeholder': {
      color: 'black.20',
    },
    '&::-webkit-outer-spin-button': {
      appearance: appearance,
    },
    '&::-webkit-inner-spin-button': {
      appearance: appearance,
    },
  },
});

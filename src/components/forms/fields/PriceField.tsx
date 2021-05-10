import { useField } from 'formik';

import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Input from 'components/base/Input';
import Text from 'components/base/Text';

interface PriceFieldProps {
  name: string;
  placeholder: string;
}

export default function PriceField(props: PriceFieldProps): JSX.Element {
  const { name, placeholder } = props;

  const [field] = useField(name);

  return (
    <Box css={{ position: 'relative' }}>
      <NumberInput
        {...field}
        placeholder={placeholder}
        color="white"
        size="large"
        type="number"
        step="any"
        inputMode="decimal"
        onWheel={(ev) => ev.currentTarget.blur()}
      />
      <PinnedLabel>ETH</PinnedLabel>
    </Box>
  );
}

const NumberInput = styled(Input, {
  width: '100%',
  borderRadius: '$2',
  fontWeight: '$body',
  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
});

const PinnedLabel = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  position: 'absolute',
  right: '$4',
  top: '50%',
  transform: 'translateY(-50%)',
  lineHeight: 1,
  color: '$black60',
});

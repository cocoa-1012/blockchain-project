import { styled } from 'stitches.config';
import * as Checkbox from '@radix-ui/react-checkbox';
import Flex from 'components/base/Flex';
import CheckIcon from 'assets/icons/check-icon.svg';

const CheckboxWrapper = styled(Checkbox.Root, {
  position: 'relative',
  width: 40,
  height: 40,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  border: 'none',
  padding: 0,
});

interface CustomCheckboxProps {
  name: string;
  checked: boolean;
  onCheckedChange: (arg0: boolean) => void;
}

export default function CustomCheckbox(
  props: CustomCheckboxProps
): JSX.Element {
  const { checked, onCheckedChange, name } = props;
  return (
    <CheckboxWrapper
      onCheckedChange={onCheckedChange}
      name={name}
      checked={checked}
    >
      <CheckboxIcon checked={checked} />
    </CheckboxWrapper>
  );
}

interface CheckboxProps {
  checked: boolean;
}

export function CheckboxIcon(props: CheckboxProps): JSX.Element {
  const { checked } = props;
  return (
    <CheckboxIconContainer isChecked={checked}>
      {checked && <CheckIcon style={{ width: 24 }} />}
    </CheckboxIconContainer>
  );
}

const CheckboxIconContainer = styled(Flex, {
  // adding float: left for the case when the checkbox is referenced in NewsletterSetting
  float: 'left',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  height: 40,
  width: 40,
  borderRadius: '$1',
  backgroundColor: '$white100',
  border: '1px solid',
  borderColor: '$black10',
  transition: 'background-color $1 $ease',
  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: '$black5',
      borderColor: '$black10',
    },
  },
  variants: {
    isChecked: {
      true: {
        backgroundColor: '$black100',
        borderColor: '$black100',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: '$black100',
            borderColor: '$black100',
          },
        },
      },
    },
  },
});

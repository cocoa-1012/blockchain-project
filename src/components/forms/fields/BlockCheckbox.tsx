import { ReactNode } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';

import { styled } from 'stitches.config';

import { CheckboxIcon } from './CustomCheckbox';

const CheckboxWrapper = styled(Checkbox.Root, {
  display: 'flex',
  position: 'relative',
  cursor: 'pointer',
  border: 'none',
  padding: '$5',
  background: '$white100',
  borderRadius: '$2',
  boxShadow: '$0',
  fontFamily: '$body',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  textAlign: 'unset',
  '@bp1': {
    padding: '$7',
  },
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: '$1',
      transform: 'translateY(-2px)',
    },
  },
});

interface BlockCheckboxProps {
  name: string;
  checked: boolean;
  onCheckedChange: (arg0: boolean) => void;
  children: ReactNode;
  css?: any;
}

export default function BlockCheckbox(props: BlockCheckboxProps): JSX.Element {
  const { onCheckedChange, checked, name, children, css } = props;

  return (
    <CheckboxWrapper
      onCheckedChange={onCheckedChange}
      name={name}
      checked={checked}
      css={css}
    >
      <CheckboxIcon checked={checked} />
      {children}
    </CheckboxWrapper>
  );
}

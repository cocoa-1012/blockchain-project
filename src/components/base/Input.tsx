import { styled } from 'stitches.config';

const Input = styled('input', {
  fontFamily: '$body',
  lineHeight: 1,
  fontSize: '$2',
  minHeight: 54,
  display: 'flex',
  alignItems: 'center',
  borderRadius: '$round',
  appearance: 'none',
  paddingLeft: '$5',
  paddingRight: '$5',
  transition: '$1',
  transitionProperty: 'box-shadow',
  fontWeight: 600,

  '&:focus': {
    outline: 'none',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: '$black5',
    boxShadow: 'none',
    border: 'solid 1px $black10',
  },

  variants: {
    color: {
      translucent: {
        backgroundColor: '$white20',
        color: '$white100',
        '&:focus, &[data-active=true]': {
          backgroundColor: '$white100',
          color: '$black100',
        },
      },
      white: {
        backgroundColor: '$white100',
        color: '$black100',
        border: 'solid 1px $black10',
      },
    },
    size: {
      large: {
        $$shadowColor: 'rgba(0, 0, 0, 0.05)',
        $$strokeColor: 'transparent',
        $$borderColor: '$colors$black100',
        $$placeholderColor: '$colors$black40',
        $$placeholderFocusColor: '$colors$black40',

        border: 'none',
        boxShadow: '0px 0px 0px 1px $$strokeColor, 0px 10px 20px $$shadowColor',
        '&::placeholder': {
          color: '$$placeholderColor',
        },
        '&:focus, &[data-active=true]': {
          boxShadow:
            'inset 0px 0px 0px 3px $$borderColor, 0px 10px 20px $$shadowColor',
          '&::placeholder': {
            color: '$$placeholderFocusColor',
          },
        },
      },
    },
  },
  compoundVariants: [
    {
      color: 'white',
      size: 'large',
      css: {
        $$strokeColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
    {
      color: 'translucent',
      size: 'large',
      css: {
        $$placeholderColor: '$colors$white100',
      },
    },
  ],
});

export default Input;

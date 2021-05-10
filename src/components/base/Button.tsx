import { styled } from 'stitches.config';

const Button = styled('button', {
  appearance: 'none',
  fontFamily: '$body',
  fontSize: '$1',
  fontWeight: 600,
  cursor: 'pointer',

  willChange: 'transform',
  transition:
    'transform $1 $ease, box-shadow $1 $ease, background-color $1 $ease, color $1 $ease',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  textAlign: 'center',
  textDecoration: 'none',

  border: 'none',

  '&:disabled': {
    pointerEvents: 'none',
  },

  variants: {
    color: {
      black: {
        backgroundColor: '$black100',
        color: '$white100',
      },
      gray: {
        color: '$black100',
        backgroundColor: '$black10',
      },
      white: {
        backgroundColor: '$white100',
        color: '$black100',
        border: 'solid 2px $black10',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: '$black100',
            borderColor: '$black100',
            color: '$white100',
          },
        },
      },
      blue: {
        backgroundColor: '$blue100',
        color: '$white100',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: '$black100',
          },
        },
      },
    },
    size: {
      regular: {
        minHeight: 46,
        paddingLeft: '$2',
        paddingRight: '$2',
      },
      large: {
        minHeight: 60,
        paddingLeft: '$5',
        paddingRight: '$5',
      },
    },
    shape: {
      regular: {
        borderRadius: '$3',
      },
      round: {
        borderRadius: '$round',
      },
    },
    hoverable: {
      true: {
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '$1',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '$0',
          },
        },
      },
    },
  },
});

export default Button;

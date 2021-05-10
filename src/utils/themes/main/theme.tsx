/* eslint-disable max-lines */
import {
  baseFonts,
  cloneFonts,
  fonts,
  fontWeights,
  fontSizes,
  lineHeights,
} from './fonts';

export const breakpoints = ['40em', '52em', '64em', '72em'];

import { Theme, ThemeUIStyleObject } from 'theme-ui';

export const colors = {
  text: 'black.100',
  background: 'white.100',
  black: {
    100: '#000000',
    95: '#0D0D0D',
    90: '#1A1A1A',
    80: '#333333',
    70: '#4D4D4D',
    60: '#666666',
    50: '#7F7F7F',
    40: '#999999',
    30: '#B3B3B3',
    20: '#CCCCCC',
    10: '#E6E6E6',
    5: '#F2F2F2',
  },
  white: {
    100: '#FFFFFF',
  },
  red: {
    100: '#F93A3A',
    10: '#ffe9ea',
  },
  green: {
    utility: '#24BE74',
    100: '#11BD6B',
    10: '#e4f9ef',
  },
  ticker: {
    green: '#1AC49B',
    teal: '#4ADBD1',
    purple: '#7D30FF',
    fuchsia: '#C41A9F',
    orange: '#F85962',
    yellow: '#F8AC5B',
    pink: '#FB236E',
  },
  utility: {
    red: '#F93A3A',
    orange: '#f1c23e',
    green: '#24BE74',
  },
};

export const space = {
  xxxxs: 0,
  xxs: 4,
  xs: 8,
  s: 16,
  m: 24,
  l: 32,
  xl: 48,
  xxl: 64,
  xxxl: 96,
  xxxxl: 128,
};

export const easing = {
  bouncy: {
    string: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    array: [0.68, -0.55, 0.265, 1.55],
  },
  smooth: {
    string: 'cubic-bezier(0.23, 1, 0.32, 1)',
    array: [0.23, 1, 0.32, 1],
  },
};

export const transitions = {
  smooth: {
    fast: `all 300ms ${easing.smooth.string}`,
    medium: `all 600ms ${easing.smooth.string}`,
    slow: `all 900ms ${easing.smooth.string}`,
    snail: `all 1200ms ${easing.smooth.string}`,
  },
};

export const styles = {
  root: {
    bg: 'transparent',
    color: '#000',
    fontFamily: 'mono',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    opacity: 1,
    transition: 'background-color 300ms ease-in-out, opacity 800ms ease-in-out',
  },
  a: {
    outline: 'none',
    textDecoration: 'none',
    color: '#000',
    '&:focus': {
      outline: 'none',
    },
    '&:active': {
      outline: 'none',
    },
  },
};

export const text: Record<string, ThemeUIStyleObject> = {
  // generate font variants from data
  h: cloneFonts({ fontFamily: 'body', fontWeight: 'heading' }, baseFonts),
  stnd: cloneFonts({ fontFamily: 'body', fontWeight: 'body' }, baseFonts),
  mono: cloneFonts({ fontFamily: 'mono', fontWeight: 'body' }, baseFonts),
  dspl: cloneFonts({ fontFamily: 'display', fontWeight: 'heading' }, baseFonts),

  body: {
    big: {
      fontFamily: 'body',
      fontSize: ['body', 'xs', 's'],
      fontWeight: 'sub',
      lineHeight: 'body',
    },
    mid: {
      fontFamily: 'body',
      fontSize: ['body', 'xs', 'xs', 20],
      fontWeight: 'body',
      lineHeight: 'body',
    },
    body: {
      fontFamily: 'body',
      fontSize: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },

    quote: {
      variant: 'text.heading.h3',
    },
  },

  droppingSoon: {
    fontFamily: 'mono',
    fontSize: 12,
    lineHeight: 1.7,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 'm',
  },

  gradient: {
    fontFamily: 'body',
    background:
      'linear-gradient(110.78deg, #76E650 -1.13%, #F9D649 15.22%, #F08E35 32.09%, #EC5157 48.96%, #FF18BD 67.94%, #1A4BFF 85.34%, #62D8F9 99.57%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  gradientLeft: {
    fontFamily: 'body',
    background:
      'linear-gradient(110.78deg, #76E650 -1.13%, #F9D649 15.22%, #F08E35 32.09%, #EC5157 48.96%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  gradientRight: {
    fontFamily: 'body',
    background:
      'linear-gradient(110.78deg, #FF18BD 35.94%, #1A4BFF 85.34%, #62D8F9 99.57%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  heading: {
    massive: {
      fontFamily: 'body',
      fontWeight: 'heading',
      // fontSize: 'calc(8.7712135779vw + 33.9970845208px)', // https://codepen.io/jakobud/pen/LyZJRB
      fontSize: 'calc(8.8262910798vw + 12.9014084507px)',
      lineHeight: 0.8,
      letterSpacing: '-0.3vw',
    },
    displayMassive: {
      fontFamily: 'body',
      fontWeight: 'sub',
      fontSize: [52, 'calc(8.8262910798vw + 12.9014084507px)'],
      lineHeight: 0.9,
      letterSpacing: '-0.4vw',
    },
    semiMassive: {
      variant: 'text.heading.massive',
      fontSize: [40, 'calc(8.8262910798vw + 12.9014084507px)'],
    },
    displaySemiMassive: {
      fontFamily: 'body',
      fontWeight: 'sub',
      fontSize: [40, 'calc(7.5vw + 12.9014084507px)'],
      lineHeight: 0.9,
      letterSpacing: '-0.3vw',
    },
    huge: {
      variant: 'text.heading.massive',
      fontSize: 'calc(6.35vw + 12.9014084507px)',
    },
    xxxl: {
      fontFamily: 'body',
      fontWeight: 'heading',
      fontSize: ['xl', 'xxxl'],
      lineHeight: 0.9,
      letterSpacing: [-2, -3],
    },
    xl: {
      fontFamily: 'body',
      fontWeight: 'heading',
      fontSize: ['l', 'xl'],
      lineHeight: 1,
      letterSpacing: [-1, -2],
    },
    m: {
      fontFamily: 'body',
      fontWeight: 'heading',
      fontSize: ['s', 'm'],
      lineHeight: 'heading',
    },
    mid: {
      lineHeight: [1, 0.95, 0.95],
      fontWeight: 'heading',
      fontFamily: 'body',
      letterSpacing: '-0.3vw',
      fontSize: 'calc(5.2582159624vw + 20.2816901408px)',
    },
    small: {
      lineHeight: [1, 0.95, 0.95],
      fontWeight: 'heading',
      fontFamily: 'body',
      letterSpacing: '-2.5px',
      fontSize: ['m', null, 'xl'],
    },
    tiny: {
      lineHeight: [1, 0.95, 0.95],
      fontWeight: 'heading',
      fontFamily: 'body',
      fontSize: 's',
    },
    title: {
      lineHeight: '0.92',
      fontWeight: 'heading',
      fontFamily: 'body',
      letterSpacing: ['-1px', null, '-2px'],
      fontSize: ['s', 'l', 'xxl'],
    },
    h1: {
      fontSize: ['l', null, 'xl'],
      letterSpacing: ['-1px', null, '-2px'],
      fontWeight: 'heading',
      fontFamily: 'body',
      lineHeight: ['1'],
    },
    h2: {
      variant: 'text.heading.h1',
      fontSize: ['m', null, 'l'],
    },
    h3: {
      variant: 'text.heading.h2',
      fontSize: ['s', null, 'm'],
    },
    fourOhFour: {
      fontFamily: 'pixel',
      fontSize: [100, 140, 200, 260, 320],
      lineHeight: 0.8,
      textTransform: 'uppercase',
      fontWeight: 'body',
    },
  },
};

export const links = {
  blank: {
    textDecoration: 'none',
  },

  underline: {
    cursor: 'pointer',
    color: 'inherit',
    fontFamily: 'body',
    textDecoration: 'none',
    boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.35)',
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        color: 'white.100',
      },
    },
  },
  white: {
    cursor: 'pointer',
    color: 'white.100',
    fontFamily: 'body',
    fontSize: ['sub', 'body'],
    fontWeight: 'sub',
    opacity: 1,
    textDecoration: 'none',
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  },
  opaque: {
    cursor: 'pointer',
    color: 'white.100',
    fontFamily: 'body',
    fontSize: ['sub', 'body'],
    fontWeight: 'sub',
    opacity: 0.4,
    textDecoration: 'none',
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        opacity: 1,
      },
    },
  },
  light: {
    cursor: 'pointer',
    color: 'white.100',
    fontFamily: 'body',
    fontSize: ['sub', 'body'],
    fontWeight: 'body',
    opacity: 0.2,
    textDecoration: 'none',
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        opacity: 1,
      },
    },
  },
  inline: {
    color: 'black.100',
    cursor: 'pointer',
    borderBottom: 'solid 1px',
    borderColor: 'black.10',
    textDecoration: 'none',
    paddingBottom: 1,
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        borderColor: 'black.100',
      },
    },
  },
  black: {
    color: 'black.100',
    cursor: 'pointer',
    fontFamily: 'body',
    fontSize: ['sub', 'body'],
    fontWeight: 'sub',
    textDecoration: 'none',
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  },
  social: {
    display: 'block',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  },
};

export const forms: Record<string, ThemeUIStyleObject> = {
  input: {
    variant: 'forms.inputs.primary',
  },
  textarea: {
    variant: 'forms.inputs.primary',
    py: 'm',
    lineHeight: 1.5,
  },
  select: {
    variant: 'forms.inputs.primary',
    lineHeight: 2,
    appearance: 'none',
    '& option': {
      minHeight: 60,
    },
  },

  inputs: {
    base: {
      lineHeight: 1,
      fontFamily: 'body',
      border: 'none',
      transition: transitions.smooth.fast,
      transitionProperty: 'box-shadow',
    },
    primary: {
      variant: 'forms.inputs.base',
      bg: 'white.100',
      minHeight: 60,
      px: 20,
      borderRadius: 10,
      boxShadow: 'inset 0 0 0 1px #E6E6E6, 0px 10px 20px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      '&:focus': {
        boxShadow: 'inset 0 0 0 2px #000000, 0px 10px 20px rgba(0, 0, 0, 0.1)',
      },
      '&:disabled': {
        bg: 'black.5',
        cursor: 'not-allowed',
      },
    },
    newsletter: {
      fontSize: [28, 28, 'm', 'l'],
      letterSpacing: [-1.2, -1],
      boxShadow: 'none',
      px: 0,
      pb: 's',
      bg: 'transparent',

      borderBottom: 'solid 1px',
      borderRadius: 0,

      borderColor: 'rgba(255, 255, 255, 0.2)',

      '&::-moz-placeholder': {
        color: 'white.100',
        opacity: 1,
      },
      '::-webkit-input-placeholder': {
        color: 'white.100',
        opacity: 1,
      },
      '&:-ms-input-placeholder': {
        color: 'white.100',
        opacity: 1,
      },

      '@media (hover: hover)': {
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.4)',
        },
      },

      '&:focus': {
        boxShadow: 'none',
        borderColor: 'rgba(255, 255, 255, 0.4)',
      },
    },
  },

  address: {
    variant: 'forms.inputs.primary',
    fontFamily: 'mono',
    fontSize: 'sub',
    letterSpacing: 0,
  },

  token: {
    fontFamily: 'mono',
    fontSize: 'l',
    border: 'none',
    textAlign: 'center',
    outline: 'none',
    appearance: 'none',
    '&::-webkit-inner-spin-button': {
      appearance: 'none',
    },
    '&::-webkit-outer-spin-button': {
      appearance: 'none',
    },
    '&::placeholder': {
      color: 'black.20',
    },
  },

  large: {
    borderRadius: 0,
    border: 'none',
    fontFamily: 'body',
    fontSize: [28, 28, 'm', 'l'],
    letterSpacing: [-1.2, -2],
    fontWeight: 'body',
    textDecoration: 'none',
    transition: transitions.smooth.fast,
    transitionProperty: 'box-shadow',
    borderBottom: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingY: 'm',
    outline: 'none',

    '&::-moz-placeholder': {
      opacity: 0.5,
      transition: transitions.smooth.fast,
    },
    '::-webkit-input-placeholder': {
      opacity: 0.5,
      transition: transitions.smooth.fast,
    },
    '&:-ms-input-placeholder': {
      opacity: 0.5,
      transition: transitions.smooth.fast,
    },
    '@media (hover: hover)': {
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.4)',
        '&::-moz-placeholder': {
          opacity: 0.4,
        },
        '::-webkit-input-placeholder': {
          opacity: 0.4,
        },
        '&:-ms-input-placeholder': {
          opacity: 0.4,
        },
      },
    },

    '&:focus': {
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
  },
};

export const buttons: Record<string, ThemeUIStyleObject> = {
  base: {
    willChange: 'transform',
    fontFamily: 'body',
    fontWeight: 'heading',
    px: ['s', null, 'm'],
    py: ['xs', null, 's'],
    borderRadius: 999,
    transition: transitions.smooth.fast,
    cursor: 'pointer',
    outline: 'none',
  },

  blank: {
    variant: 'buttons.base',
    '@media (hover: hover)': {
      '&:hover': {
        boxShadow: 'button',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },

  transparent: {
    py: 5,
    cursor: 'pointer',
    outline: 'none',
    bg: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    willChange: 'transform',
  },
  icon: {
    cursor: 'pointer',
    bg: 'transparent',
    border: 'none',
    color: 'black.80',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        color: 'white.100',
      },
    },
  },
  primary: {
    variant: 'buttons.base',
    bg: 'black.100',
    color: 'white.100',
    border: 'solid 2px',
    borderColor: 'black.90',
    borderRadius: 15,
    px: 'l',
    py: 's',
    minHeight: 60,
    willChange: 'transform',
    '&:disabled': {
      bg: 'black.20',
      borderColor: 'black.20',
      pointerEvents: 'none',
    },
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'black.100',
        color: 'white.100',
        boxShadow: 'button',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  loading: {
    variant: 'buttons.primary',
    paddingX: [20, 20, 20],
    willChange: 'transform',
    '&:disabled': {
      bg: 'black.100',
      borderColor: 'black.100',
      pointerEvents: 'none',
    },
  },
  white: {
    variant: 'buttons.primary',
    bg: 'white.100',
    color: 'black.100',
    borderColor: 'white.100',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'black.100',
        color: 'white.100',
        borderColor: 'black.100',
        boxShadow: 'button',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  outline: {
    variant: 'buttons.base',
    bg: 'transparent',
    color: 'black.100',
    border: 'solid 2px',
    borderColor: 'black.90',
    borderRadius: 15,
    px: ['s', 'm', 'l'],
    py: ['xs', null, 's'],
    minHeight: 60,
    willChange: 'transform',
    '&:disabled': {
      bg: 'transparent',
      borderColor: 'black.20',
      pointerEvents: 'none',
      color: 'black.40',
    },
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'black.100',
        color: 'white.100',
        boxShadow: 'button',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  roundedOutline: {
    variant: 'buttons.base',
    bg: 'transparent',
    color: 'black.100',
    border: 'solid 2px',
    borderColor: 'black.90',
    px: ['s', 'm', 'l'],
    py: ['s', null, 's'],
    minHeight: 60,
    willChange: 'transform',
    '&:disabled': {
      bg: 'transparent',
      borderColor: 'black.20',
      pointerEvents: 'none',
      color: 'black.40',
    },
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'black.100',
        color: 'white.100',
        boxShadow: 'button',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  warning: {
    variant: 'buttons.base',
    bg: 'utility.red',
    color: 'white.100',
    borderColor: 'utility.red',
    borderRadius: 15,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'utility.red',
        color: 'white.100',
        boxShadow: 'm',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },

  empty: {
    variant: 'buttons.base',
    bg: 'black.10',
    cursor: 'not-allowed',
    borderRadius: 15,
    px: 'l',
    minHeight: 60,
  },

  small: {
    variant: 'buttons.outline',
    minHeight: 0,
    px: [12, 12, 12],
    py: ['xs', 'xs', 'xs'],
    '&:disabled': {
      borderColor: 'black.20',
      pointerEvents: 'none',
      color: 'black.20',
    },
  },

  smallGhost: {
    variant: 'buttons.small',
    bg: 'transparent',
    borderColor: 'rgba(255,255,255,0.2)',
    color: 'white.100',
    maxWidth: 120,
    marginX: 'auto',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
        bg: 'white.100',
        color: 'black.100',
        borderColor: 'white.100',
      },
    },
  },

  tiny: {
    variant: 'buttons.outline',
    px: [10, 10, 10],
    py: [0, 0, 0],
    minHeight: 0,
    lineHeight: '24px',
    fontSize: 14,
    borderRadius: 999,
    willChange: 'transform',
    '&:disabled': {
      borderColor: 'black.20',
      pointerEvents: 'none',
      color: 'black.20',
    },
  },

  ghost: {
    variant: 'buttons.base',
    bg: 'transparent',
    color: 'black.100',
    border: 'solid 2px',
    borderColor: 'black.100',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'black.100',
        color: 'white.100',
        boxShadow: 'button',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  ghostGray: {
    variant: 'buttons.base',
    bg: 'transparent',
    color: 'black.100',
    border: 'solid 2px',
    borderColor: 'black.10',
    maxWidth: 260,
    width: 260,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'black.100',
        color: 'white.100',
        boxShadow: 'button',
        transform: 'translateY(-2px)',
        borderColor: 'black.100',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  // TODO: DRY this with ghostGray if it will stay around
  ghostGraySmall: {
    variant: 'buttons.small',
    bg: 'transparent',
    color: 'black.100',
    border: 'solid 2px',
    borderColor: 'black.10',
    borderRadius: 20,
    maxWidth: 260,
    maxHeight: 50,
    width: 260,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'black.100',
        color: 'white.100',
        boxShadow: 'button',
        transform: 'translateY(-2px)',
        borderColor: 'black.100',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  ghostReversed: {
    variant: 'buttons.base',
    bg: 'transparent',
    color: 'white.100',
    border: 'solid 1px',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'rgba(255, 255, 255, 0.2)',
        color: 'white.100',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
  ghostSolid: {
    variant: 'buttons.base',
    bg: 'transparent',
    color: 'white.100',
    border: 'solid 2px',
    borderColor: 'white.100',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        bg: 'white.100',
        color: 'black.100',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'none',
        transform: 'translateY(0)',
      },
    },
  },
};

const boxes = {
  outer: {
    marginX: ['xl', 'xxxl'],
    position: 'relative',
  },
  inner: {
    marginX: ['xl', 'xxxl'],
    position: 'relative',
  },
};

const shadows = {
  s: '0px 10px 20px rgba(0, 0, 0, 0.05)',
  m: '0px 10px 20px rgba(0, 0, 0, 0.1)',
  l: '0px 15px 20px rgba(0,0,0,0.15)',
  button: '0px 8px 15px rgba(0, 0, 0, 0.25)',
};

const sizes = {
  measure: 320,
  container: 1600,
};

const borders = {
  black: {
    2: 'solid 2px black',
  },
};

// TODO: Move away from this pattern
// "I envision a solution that will build out custom component variants as components vs. being in theme."
// - Lawrence Gosset
interface ThemeExtended extends Theme {
  boxes: any;
  easing: any;
  transitions: any;
}

export const theme: ThemeExtended = {
  borders,
  boxes,
  breakpoints,
  buttons,
  colors,
  easing,
  fonts,
  fontSizes,
  fontWeights,
  forms,
  lineHeights,
  links,
  shadows,
  sizes,
  space,
  styles,
  text,
  transitions,
};

import { createCss, StitchesCss } from '@stitches/react';

const stitches = createCss({
  theme: {
    colors: {
      black100: '#000000',
      black95: '#0D0D0D',
      black90: '#1A1A1A',
      black80: '#333333',
      black70: '#4D4D4D',
      black60: '#666666',
      black50: '#7F7F7F',
      black40: '#999999',
      black30: '#B3B3B3',
      black20: '#CCCCCC',
      black10: '#E6E6E6',
      black5: '#F2F2F2',

      white20: 'rgba(255, 255, 255, 0.2)',
      white100: '#FFFFFF',

      red100: '#F93A3A',
      red10: '#ffe9ea',

      green100: '#24be74',
      green10: '#e4f9ef',

      orange100: '#f1c23e',

      blue100: '#0101FF',
    },
    space: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '32px',
      8: '48px',
      9: '64px',
      10: '96px',
      11: '128px',
    },
    fonts: {
      body: `"Roobert", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      mono: `"FormularMono", Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace`,
      secondary: `"Roobert", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      display: `"Foundation Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      roobert: `"Roobert", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    },
    fontSizes: {
      0: '14px',
      1: '16px',
      2: '18px',
      3: '24px',
      4: '36px',
      5: '46px',
      6: '56px',
      7: '66px',
      8: '76px',
      9: '86px',
      13: '126px',
    },
    radii: {
      0: '0px',
      1: '5px',
      2: '10px',
      3: '15px',
      round: '9999px',
    },
    shadows: {
      stroke: 'inset 0 0 0 3px #000',
      0: '0px 10px 20px rgba(0, 0, 0, 0.05)',
      1: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      2: '0px 15px 20px rgba(0, 0, 0, 0.15)',
      3: '0px 8px 15px rgba(0, 0, 0, 0.25)',
      button: '$3',
    },
    transitions: {
      0: '100ms',
      1: '300ms',
      2: '500ms',
      3: '1000ms',
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    },
    sizes: {
      container: '1600px',
    },
    lineHeights: {
      body: 1.7,
    },
  },
  media: {
    bp0: '(min-width: 40em)',
    bp1: '(min-width: 52em)',
    bp2: '(min-width: 64em)',
    bp3: '(min-width: 72em)',
    bp4: '(min-width: 80em)',
  },
  utils: {
    // Margin
    margin: () => (value) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    marginX: () => (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: () => (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    // Padding
    padding: () => (value) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingX: () => (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: () => (value) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
  prefix: 'st-',
});

export type CSS = StitchesCss<typeof stitches>;

export const {
  styled,
  css,
  global: globalCss,
  keyframes,
  getCssString,
  theme,
  config,
} = stitches;

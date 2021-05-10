import { map, assoc, compose } from 'ramda';

interface CloneFontsArgs {
  fontFamily: string;
  fontWeight: string;
}

export const cloneFonts = (
  { fontFamily, fontWeight }: CloneFontsArgs,
  fontMap: any
): any =>
  compose(
    map(assoc('fontWeight', fontWeight)),
    map(assoc('fontFamily', fontFamily))
  )(fontMap);

export const fonts = {
  body: `"Roobert", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  mono: `"FormularMono", Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace`,
};

export const fontSizes = {
  xxxl: 76,
  xxl: 66,
  xl: 56,
  l: 46,
  m: 36,
  s: 24,
  xs: 18,
  body: 16,
  sub: 14,
};

export const fontWeights = {
  body: 400,
  sub: 500,
  heading: 600,
};

export const lineHeights = {
  body: '1.7',
};

export const baseFonts = {
  caption: {
    fontFamily: 'mono',
    fontSize: [10, null, 'sub'],
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  sub: {
    fontFamily: 'body',
    fontSize: 'sub',
    fontWeight: 'heading',
  },
  body: {
    fontFamily: 'body',
    fontSize: 'body',
    fontWeight: 'heading',
  },
  xs: {
    fontFamily: 'body',
    fontSize: 'xs',
    fontWeight: 'heading',
  },
  s: {
    fontFamily: 'body',
    fontSize: 's',
    fontWeight: 'heading',
  },
  m: {
    fontFamily: 'body',
    fontSize: ['s', null, 'm'],
    letterSpacing: '-0.01em',
    fontWeight: 'heading',
  },
  l: {
    fontFamily: 'body',
    fontSize: ['m', null, 'l'],
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    fontWeight: 'heading',
  },
  xl: {
    fontFamily: 'body',
    fontSize: ['l', null, 'xl'],
    lineHeight: 1,
    letterSpacing: '-0.02em',
    fontWeight: 'heading',
  },
  xxl: {
    fontFamily: 'body',
    fontSize: ['l', 'xl', 'xxl'],
    lineHeight: 1,
    letterSpacing: '-0.02em',
    fontWeight: 'heading',
  },
  xxxl: {
    fontFamily: 'body',
    fontSize: ['xl', 'xl', 'xxxl'],
    lineHeight: 1,
    letterSpacing: '-0.03em',
    fontWeight: 'heading',
  },
  xxxxl: {
    fontFamily: 'body',
    fontSize: ['xl', 'xl', 'xxxl', '178px'],
    lineHeight: [1, 1, 0.9, 0.8],
    letterSpacing: '-0.03em',
    fontWeight: 'heading',
  },
};

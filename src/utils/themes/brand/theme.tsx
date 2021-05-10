import { theme } from 'stitches.config';

// override the default theme + add new styles for the brand pages
const brandTheme = theme({
  colors: {},
  fonts: {
    // overrides roobert as the default body font
    body: `"ABCMarfa", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
});

export default brandTheme;

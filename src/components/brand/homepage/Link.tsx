import { styled } from 'stitches.config';

const Link = styled('a', {
  color: '$black100',
  fontFamily: '$body',
  textDecoration: 'none',
  borderBottom: '1px solid $black10',
  transition: 'color $1 $ease, border-bottom $ease',
  paddingBottom: '$1',
  '&:hover': {
    color: '$blue100',
    borderBottomColor: '$blue100',
  },
  variants: {
    size: {
      small: {
        fontSize: '$0',
        '@bp1': {
          fontSize: '$s1',
        },
      },
    },
  },
});

export default Link;

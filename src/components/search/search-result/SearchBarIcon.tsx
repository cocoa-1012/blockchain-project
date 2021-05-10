import { styled } from 'stitches.config';

import Box from 'components/base/Box';

const SearchBarIcon = styled(Box, {
  top: '50%',
  transform: 'translateY(-50%)',
  position: 'absolute',
  color: '$black30',
  transition: 'color $0 $ease',
  cursor: 'pointer',
  variants: {
    color: {
      white: {
        color: '$white100',
        '&[data-active=true]': {
          color: '$black100',
        },
        '@media (hover: hover)': {
          '&:hover': {
            color: '$black100',
          },
        },
      },
      black: {
        color: '$black30',
        '&[data-active=true]': {
          color: '$black100',
        },
        '@media (hover: hover)': {
          '&:hover': {
            color: '$black100',
          },
        },
      },
    },
    focused: {
      true: {
        $$iconColor: '$colors$black30',
        color: '$$iconColor',
        '@media (hover: hover)': {
          '&:hover': {
            color: '$black100',
          },
        },
      },
    },
  },
  compoundVariants: [
    {
      color: 'white',
      focused: true,
      css: {
        $$iconColor: '$colors$black30',
      },
    },
  ],
});

export default SearchBarIcon;

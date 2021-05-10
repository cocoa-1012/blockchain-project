import { styled } from 'stitches.config';

import Box from 'components/base/Box';

const TableRow = styled(Box, {
  position: 'relative',
  paddingY: '$6',
  marginBottom: '$3',
  borderRadius: '$1',
  backgroundColor: '$white100',
  alignItems: 'center',
  transition: 'transform $1 $ease',
  paddingX: '$2',
  '&:before': {
    content: '',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
    boxShadow: '$0',
    borderRadius: '$2',
    transition: 'transform $1 $ease, box-shadow $1 $ease',
  },
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  '@bp2': { paddingX: 0 },
  variants: {
    isLinkRow: {
      true: {
        '@media (hover: hover)': {
          '&:hover': {
            '&:before': {
              boxShadow: '$1',
            },
          },
        },
      },
    },
  },
});

export default TableRow;

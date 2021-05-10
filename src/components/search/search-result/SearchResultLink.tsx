import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';

const SearchResultLink = styled(Flex, {
  textDecoration: 'none',
  alignItems: 'center',
  transition: 'background-color $0 $ease',
  borderRadius: '$2',
  padding: '$3',
  variants: {
    size: {
      large: {
        paddingX: '$6',
        paddingY: '$5',
      },
    },
  },
  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: '$black5',
    },
  },
});

export default SearchResultLink;

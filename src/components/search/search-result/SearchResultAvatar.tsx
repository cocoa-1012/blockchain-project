import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';

const SearchResultAvatar = styled(Flex, {
  width: 32,
  height: 32,
  flexShrink: 0,
  flexGrow: 0,
  marginRight: '$3',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$2',
  variants: {
    size: {
      large: {
        marginRight: '$6',
        width: 64,
        height: 64,
      },
    },
  },
});

export default SearchResultAvatar;

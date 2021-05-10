import Heading from 'components/base/Heading';

import { styled } from 'stitches.config';

const SearchResultHeading = styled(Heading, {
  fontSize: '$2',
  fontWeight: 'bold',
  display: 'flex',
  color: '$black100',
  fontFamily: '$body',
  variants: {
    size: {
      large: {
        fontSize: '$3',
      },
    },
    color: {
      isDark: {
        color: '$white100',
      },
    },
  },
});

export default SearchResultHeading;

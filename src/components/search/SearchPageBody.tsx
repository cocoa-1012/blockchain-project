import Body from 'components/base/Body';

import { styled } from 'stitches.config';

const SearchPageBody = styled(Body, {
  paddingTop: '$2',
  '@bp1': {
    paddingTop: '$9',
  },
  variants: {
    isLoading: {
      true: { display: 'none' },
    },
  },
});

export default SearchPageBody;

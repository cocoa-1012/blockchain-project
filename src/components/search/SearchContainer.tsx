import Grid from 'components/base/Grid';

import { styled } from 'stitches.config';

const SearchContainer = styled(Grid, {
  gap: '$3',
  '@bp2': {
    gap: '$2',
    gridTemplateColumns: '320px auto',
  },
});

export default SearchContainer;

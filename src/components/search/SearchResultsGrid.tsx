import Grid from 'components/base/Grid';
import { styled } from 'stitches.config';

const SearchResultsGrid = styled(Grid, {
  backgroundColor: '$white100',
  borderRadius: '$2',
  padding: '$5',
  gap: '$3',
  boxShadow: '$1',
  '@bp1': {
    boxShadow: '$2',
  },
});

export default SearchResultsGrid;

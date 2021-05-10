import Box from 'components/base/Box';

import { styled } from 'stitches.config';

const SearchFiltersContainer = styled(Box, {
  display: 'none',
  '@bp2': {
    display: 'block',
    position: 'sticky',
    top: 0,
    left: 0,
    alignSelf: 'flex-start',
    paddingTop: '$6',
    marginTop: '-$6',
    overflow: 'auto',
    height: '100vh',
    paddingBottom: '$7',
    paddingRight: '$6',
    paddingLeft: '$3',
    marginLeft: '-$3',
  },
});

export default SearchFiltersContainer;

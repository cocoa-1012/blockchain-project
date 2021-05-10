import { compose, any, values } from 'ramda';
import { Index, connectStateResults } from 'react-instantsearch-dom';

import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import SearchEmptyState from 'components/search/SearchEmptyState';
import SpinnerStroked from 'components/SpinnerStroked';

import { styled } from 'stitches.config';

const hasSearchResults = compose<any, SearchResults[], boolean>(
  any((results) => results.nbHits > 0),
  values
);

const EmptyStateContainer = styled(Flex, {
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: '$10',
  paddingBottom: '$10',
  gap: '$4',
});

interface SearchResults {
  nbHits: number;
}

const SearchResultsContainer = connectStateResults((props) => {
  const { allSearchResults, searchState, searching, children } = props;

  const hasResults = hasSearchResults(allSearchResults);

  return hasResults ? (
    <>
      <Box css={{ display: searching ? 'none' : 'block' }}>{children}</Box>
      <Flex
        css={{ display: searching ? 'flex' : 'none', minHeight: 360 }}
        center
      >
        <SpinnerStroked size={32} />
      </Flex>
    </>
  ) : (
    <EmptyStateContainer>
      <Index indexName="artworks" />
      <Index indexName="users" />

      <Grid css={{ gap: '$7', justifyContent: 'center' }}>
        <SearchEmptyState
          heading="No search results"
          description={`There are no search results for ‘${searchState.attributeForMyQuery}’`}
          headingSize="$4"
        />
      </Grid>
    </EmptyStateContainer>
  );
});

export default SearchResultsContainer;

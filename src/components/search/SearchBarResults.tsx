import { styled } from 'stitches.config';
import { Index, Configure } from 'react-instantsearch-dom';

import {
  SearchResultsArtworks,
  SearchResultsUsers,
} from 'components/search/search-result/SearchResultsSection';
import SearchResultsContainer from 'components/search/search-result/SearchResultsContainer';
import SearchResultsGrid from 'components/search/SearchResultsGrid';
import Box from 'components/base/Box';

const SearchPane = styled(Box, {
  position: 'absolute',
  left: 0,
  top: '$4',
  width: 'calc(100vw - 48px)',
  zIndex: 1000,
  '@bp1': {
    width: '100%',
  },
});

export default function SearchBarResults(): JSX.Element {
  return (
    <SearchPane>
      <SearchResultsGrid>
        <SearchResultsContainer>
          <Index indexName="users">
            <Configure
              facetFilters={['moderationStatus:ACTIVE', 'isHidden:false']}
            />
            <SearchResultsUsers />
          </Index>

          <Index indexName="artworks">
            <Configure
              facetFilters={[
                'moderationStatus:ACTIVE',
                'isDeleted:false',
                'isHidden:false',
              ]}
            />
            <SearchResultsArtworks />
          </Index>
        </SearchResultsContainer>
      </SearchResultsGrid>
    </SearchPane>
  );
}

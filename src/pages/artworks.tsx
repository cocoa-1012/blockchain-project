/* eslint-disable react/jsx-max-depth */
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useState } from 'react';
import { useRouter } from 'next/router';

import { css } from 'stitches.config';

import Page from 'components/Page';
import Grid from 'components/base/Grid';

import ArtworkSearchResults from 'components/search/artworks/ArtworkSearchResults';
import ArtworkSearchFilters from 'components/search/artworks/ArtworkSearchFilters';
import LoadingPage from 'components/LoadingPage';
import SearchFiltersStacked from 'components/search/SearchFiltersStacked';
import SearchNavigationSortBar from 'components/search/algolia/SearchNavigationSortBar';
import SearchNavigationSortOptions from 'components/search/algolia/SearchNavigationSortOptions';
import SearchFiltersToggle from 'components/search/SearchFiltersToggle';
import SearchFiltersContainer from 'components/search/SearchFiltersContainer';
import SearchContainer from 'components/search/SearchContainer';
import SearchPageBody from 'components/search/SearchPageBody';

import searchClient, { algoliaArtworksIndexes } from 'lib/clients/algolia';
import { urlToSearchState, searchStateToUrl, createUrl } from 'utils/algolia';

import useSearchState from 'state/stores/search';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

const loadingPageStyles = css({ paddingBottom: '0 !important' })();

export default function Artworks(): JSX.Element {
  const router = useRouter();
  const [searchState, setSearchState] = useState(urlToSearchState(router));
  const isSearchLoading = useSearchState((state) => state.isLoading);
  const artworkAvailability = useSearchState(
    (state) => state.artworkAvailabilities
  );

  const availableIndexes = algoliaArtworksIndexes.filter((index) =>
    index.enabledModes.some((mode) => artworkAvailability.includes(mode))
  );
  const defaultRefinement = availableIndexes[0].value;

  const [searchOpen, searchSearchOpen] = useState(false);

  const openSearch = () => searchSearchOpen(true);
  const closeSearch = () => searchSearchOpen(false);

  const handleSearchStateChange = (state) => {
    const { refinementList, range, sortBy } = state;
    // console.log(state, 'searchState');
    setSearchState(state);
    // If router isnt ready return early to stop update of default state
    if (!router.isReady) {
      return;
    }

    const currentQueryString = searchStateToUrl(router.query);
    const releventQueries = { refinementList, sortBy, range };
    const queryString = searchStateToUrl(releventQueries);
    // We only want to scroll to top if the query string has changed
    const hasQueryStringChanged = currentQueryString !== queryString;

    if (hasQueryStringChanged) {
      router.push(`?${queryString}`, undefined, {
        shallow: true,
        scroll: true,
      });
    }
  };

  return (
    <Page title="Artworks" footerStyle={{ display: 'none' }}>
      <InstantSearch
        searchClient={searchClient}
        indexName="artworks"
        createURL={createUrl}
        onSearchStateChange={handleSearchStateChange}
        searchState={searchState}
      >
        <Configure
          hitsPerPage={PUBLIC_FEED_PER_PAGE_COUNT}
          facetFilters={[
            'moderationStatus:ACTIVE',
            'isDeleted:false',
            'isHidden:false',
          ]}
        />
        {isSearchLoading && <LoadingPage className={loadingPageStyles} />}

        <SearchFiltersStacked
          isOpen={searchOpen}
          closeSearch={closeSearch}
          filters={[
            <SearchNavigationSortOptions
              key="search"
              algoliaIndexes={availableIndexes}
              orientation="vertical"
              defaultRefinement={defaultRefinement}
            />,
            <ArtworkSearchFilters key="filters" />,
          ]}
        />

        <SearchPageBody isLoading={isSearchLoading}>
          <Grid css={{ gap: '$7', alignItems: 'flex-start' }}>
            <SearchNavigationSortBar
              algoliaIndexes={availableIndexes}
              defaultRefinement={defaultRefinement}
            />
            <SearchContainer>
              <SearchFiltersContainer>
                <ArtworkSearchFilters />
              </SearchFiltersContainer>
              <ArtworkSearchResults />

              <SearchFiltersToggle openSearch={openSearch} />
            </SearchContainer>
          </Grid>
        </SearchPageBody>
      </InstantSearch>
    </Page>
  );
}

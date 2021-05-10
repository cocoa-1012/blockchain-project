/* eslint-disable react/jsx-max-depth */
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useState } from 'react';
import { useRouter } from 'next/router';

import { css } from 'stitches.config';

import Page from 'components/Page';
import Grid from 'components/base/Grid';

import ProfileSearchFilters from 'components/search/profiles/ProfileSearchFilters';
import ProfileSearchResults from 'components/search/profiles/ProfileSearchResults';
import LoadingPage from 'components/LoadingPage';
import SearchFiltersStacked from 'components/search/SearchFiltersStacked';
import SearchNavigationSortBar from 'components/search/algolia/SearchNavigationSortBar';
import SearchNavigationSortOptions from 'components/search/algolia/SearchNavigationSortOptions';
import SearchFiltersToggle from 'components/search/SearchFiltersToggle';
import SearchFiltersContainer from 'components/search/SearchFiltersContainer';
import SearchContainer from 'components/search/SearchContainer';
import SearchPageBody from 'components/search/SearchPageBody';

import searchClient, { algoliaUsersIndexes } from 'lib/clients/algolia';
import { urlToSearchState, searchStateToUrl, createUrl } from 'utils/algolia';

import useSearchState from 'state/stores/search';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

const loadingPageStyles = css({ paddingBottom: '0 !important' })();

export default function Profiles(): JSX.Element {
  const router = useRouter();
  const [searchState, setSearchState] = useState(urlToSearchState(router));
  const isSearchLoading = useSearchState((state) => state.isLoading);

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
    <Page title="Profiles" footerStyle={{ display: 'none' }}>
      <InstantSearch
        searchClient={searchClient}
        indexName="users"
        createURL={createUrl}
        onSearchStateChange={handleSearchStateChange}
        searchState={searchState}
      >
        <Configure
          hitsPerPage={PUBLIC_FEED_PER_PAGE_COUNT}
          facetFilters={['moderationStatus:ACTIVE', 'isHidden:false']}
        />
        {isSearchLoading && <LoadingPage className={loadingPageStyles} />}

        <SearchFiltersStacked
          isOpen={searchOpen}
          closeSearch={closeSearch}
          filters={[
            <SearchNavigationSortOptions
              key="search"
              algoliaIndexes={algoliaUsersIndexes}
              orientation="vertical"
              defaultRefinement="users_sort_total_vol_desc"
            />,
            <ProfileSearchFilters key="filters" />,
          ]}
        />

        <SearchPageBody isLoading={isSearchLoading}>
          <Grid css={{ gap: '$7', alignItems: 'flex-start' }}>
            <SearchNavigationSortBar
              algoliaIndexes={algoliaUsersIndexes}
              defaultRefinement="users_sort_total_vol_desc"
            />
            <SearchContainer>
              <SearchFiltersContainer>
                <ProfileSearchFilters />
              </SearchFiltersContainer>
              <ProfileSearchResults />

              <SearchFiltersToggle openSearch={openSearch} />
            </SearchContainer>
          </Grid>
        </SearchPageBody>
      </InstantSearch>
    </Page>
  );
}

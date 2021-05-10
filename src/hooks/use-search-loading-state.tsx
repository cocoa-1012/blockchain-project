import { useEffect } from 'react';

import useSearchState from 'state/stores/search';

import { isEmptyOrNil } from 'utils/helpers';

interface SearchLoadingStateArgs {
  results: any[];
}

export default function useSearchLoadingState({
  results,
}: SearchLoadingStateArgs): null {
  const isSearchLoading = useSearchState((state) => state.isLoading);
  const setSearchLoading = useSearchState((state) => state.setSearchLoading);

  const noResults = isEmptyOrNil(results);

  const hasInitialSearchLoaded = isSearchLoading && !noResults;

  useEffect(
    () => {
      if (hasInitialSearchLoaded) {
        setSearchLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasInitialSearchLoaded]
  );

  return null;
}

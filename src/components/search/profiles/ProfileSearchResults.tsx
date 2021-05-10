import { connectInfiniteHits } from 'react-instantsearch-dom';
import { useCallback, useState, useEffect } from 'react';

import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import { CreatorCard } from 'components/cards/creator/CreatorCard';

import { styled } from 'stitches.config';

import useSearchLoadingState from 'hooks/use-search-loading-state';

import { isEmptyOrNil } from 'utils/helpers';

const ProfileSearchResults = connectInfiniteHits(
  (props): JSX.Element => {
    const { hits, hasMore, refineNext } = props;

    const noResults = isEmptyOrNil(hits);

    useSearchLoadingState({ results: hits });

    const [isFetching, setIsFetching] = useState(false);

    const handleNextPage = useCallback(() => {
      setIsFetching(true);
      refineNext();
    }, [setIsFetching, refineNext]);

    useEffect(
      () => {
        if (isFetching) {
          setIsFetching(false);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [hits]
    );

    if (noResults) {
      return null;
    }

    return (
      <Box css={{ paddingBottom: '$8' }}>
        <ResultsGrid>
          {hits.map((hit, index) => (
            <CreatorCard key={index} creator={hit} />
          ))}
        </ResultsGrid>

        <InfiniteScrollButton
          key={hits.length}
          handleNextPage={handleNextPage}
          hasNextPage={hasMore}
          isFetching={isFetching}
          animationDuration={0.05}
        />
      </Box>
    );
  }
);

const ResultsGrid = styled(Grid, {
  gap: '$5',
  '@bp1': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@bp3': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

export default ProfileSearchResults;

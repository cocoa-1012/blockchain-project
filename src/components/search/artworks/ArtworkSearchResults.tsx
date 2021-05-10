import { connectInfiniteHits } from 'react-instantsearch-dom';
import { useEffect } from 'react';
import { useState, useCallback } from 'react';

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import ArtworkCardSearch from 'components/cards/artwork/ArtworkCardSearch';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';

import useSearchLoadingState from 'hooks/use-search-loading-state';

const ArtworkSearchResults = connectInfiniteHits(
  (props): JSX.Element => {
    const { hits, hasMore, refineNext } = props;

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

    return (
      <Box css={{ paddingBottom: '$8' }}>
        <ResultsGrid>
          {hits.map((hit, index) => (
            <ArtworkCardSearch key={index} artwork={hit} />
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

export default ArtworkSearchResults;

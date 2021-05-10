import { styled } from 'stitches.config';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { useRef } from 'react';

import { splitArray } from 'utils/artwork/artwork';

import ArtworkCardSkeleton from 'components/cards/artworkV2/ArtworkCardSkeleton';
import { useIntersectionObserver } from './feed/InfiniteScrollButton';

import Artwork from 'types/Artwork';

function columnsPerBreakpoint(breakpointIndex) {
  switch (breakpointIndex) {
    case 0:
    case 1:
      return 1;
    case 2:
    case 3:
      return 2;
    case 4:
      return 3;
    default:
      break;
  }
}

function SkeletonArray(): JSX.Element {
  const emptyArray = new Array(20).fill(null);
  return (
    <>
      {emptyArray.map((_, key) => (
        <ArtworkCardSkeleton key={key} />
      ))}
    </>
  );
}

interface ColumnProps<T> {
  artworks: Artwork[];
  onReachedEnd: () => void;
  children: (props: T) => JSX.Element;
}

function Column<T>(props: ColumnProps<T>): JSX.Element {
  const { artworks, onReachedEnd, children: Children, ...rest } = props;
  const endOfColumnRef = useRef(null);

  useIntersectionObserver({
    target: endOfColumnRef,
    onIntersect: onReachedEnd,
    enabled: Boolean(onReachedEnd),
  });

  return (
    <Box>
      {artworks.map((artwork) => {
        return (
          <Children key={artwork.tokenId} artwork={artwork} {...(rest as T)} />
        );
      })}
      <Box ref={endOfColumnRef} />
    </Box>
  );
}

const Wrapper = styled(Grid, {
  gap: '$6',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@bp1': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  '@bp3': {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
});

interface MasonryGridProps<T> {
  artworks: Artwork[];
  isLoading: boolean;
  onReachedEnd?: () => void;
  children: (props: T) => JSX.Element;
}

export default function MasonryGrid<T>(
  props: MasonryGridProps<T>
): JSX.Element {
  const { artworks, isLoading, onReachedEnd, children, ...rest } = props;
  const breakpointIndex = useBreakpointIndex();

  const noOfColumns = columnsPerBreakpoint(breakpointIndex);

  const columnData = splitArray(artworks, noOfColumns);

  return (
    <Wrapper>
      {isLoading ? (
        <SkeletonArray />
      ) : (
        columnData.map((artworks, i) => (
          <Column
            key={i}
            artworks={artworks}
            onReachedEnd={onReachedEnd}
            {...rest}
          >
            {children}
          </Column>
        ))
      )}
    </Wrapper>
  );
}

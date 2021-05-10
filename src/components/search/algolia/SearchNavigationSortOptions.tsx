import { cond, equals } from 'ramda';
import { styled } from 'stitches.config';
import { connectSortBy } from 'react-instantsearch-dom';
import { useEffect } from 'react';

import { AlgoliaIndexName } from 'types/Algolia';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Grid from 'components/base/Grid';
import AlgoliaSelectField from 'components/forms/fields/algolia/AlgoliaSelectField';
import { getFirstValue } from 'utils/helpers';
import Box from 'components/base/Box';

// a component that will refine to the first
// index when the available indexes changes
const ConnectedSortBy = connectSortBy((props) => {
  const { items, refine } = props;

  const firstItem = getFirstValue(items);
  const firstValue = firstItem?.value;

  useEffect(
    () => {
      refine(firstValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [firstValue]
  );

  return null;
});
interface SearchNavigationSortBarProps {
  algoliaIndexes: AlgoliaIndexName[];
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  defaultRefinement: string;
}

export default function SearchNavigationSortOptions(
  props: SearchNavigationSortBarProps
): JSX.Element {
  const { algoliaIndexes, className, orientation, defaultRefinement } = props;

  return (
    <>
      <ConnectedSortBy items={algoliaIndexes} />
      <SearchNavigationContainer
        orientation={orientation}
        className={className}
      >
        {cond([
          [
            equals('horizontal'),
            () => (
              <>
                <IndexTabLabel css={{ marginRight: '$5' }}>
                  Sort by
                </IndexTabLabel>
                <AlgoliaSelectField
                  items={algoliaIndexes}
                  defaultRefinement={defaultRefinement}
                />
              </>
            ),
          ],
          [
            equals('vertical'),
            () => (
              <>
                <IndexTabLabel css={{ marginBottom: '$6' }}>
                  Sort by
                </IndexTabLabel>
                <Grid css={{ gap: '$3' }}>
                  <AlgoliaSelectField
                    items={algoliaIndexes}
                    defaultRefinement={defaultRefinement}
                  />
                </Grid>
              </>
            ),
          ],
        ])(orientation)}
      </SearchNavigationContainer>
    </>
  );
}

const SearchNavigationContainer = styled(Flex, {
  variants: {
    orientation: {
      vertical: {
        flexDirection: 'column',
      },
      horizontal: {
        alignItems: 'center',
        marginBottom: 'auto',
      },
    },
  },
});

const IndexTabLabel = styled(Text, {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
  color: '$black100',
  variants: {
    isActive: {
      true: {
        color: '$black100 !important',
      },
    },
  },
});

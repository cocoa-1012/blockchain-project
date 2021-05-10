import { connectRefinementList } from 'react-instantsearch-dom';
import { RefinementListProvided } from 'react-instantsearch-core';
import { useState, useCallback, useEffect } from 'react';
import { length } from 'ramda';

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import AlgoliaCheckbox, {
  CheckboxContainer,
} from 'components/forms/fields/algolia/AlgoliaCheckbox';

import { SearchResultHit } from 'types/Algolia';

import useSearchState from 'state/stores/search';

type FilterGroup = {
  title: string;
  filtersVisible: boolean;
  filters: string[];
};

type RefinementList = RefinementListProvided & {
  title: string;
  groups: FilterGroup[];
};

const FilterHeading = styled(Text, {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
});

const RadioCircle = styled(Box, {
  width: 20,
  height: 20,
  border: 'solid 2px $black10',
  borderRadius: '$round',
  position: 'relative',
  variants: {
    isActive: {
      true: {
        backgroundColor: '$black100',
        borderColor: '$black100',
        '&:after': {
          position: 'absolute',
          content: '',
          top: '50%',
          left: '50%',
          width: 8,
          height: 8,
          backgroundColor: '$black70',
          transform: 'translate(-50%, -50%)',
          borderRadius: '$round',
        },
      },
    },
  },
});

const GroupedRefinementFilters = connectRefinementList<RefinementList>(
  (props) => {
    const { items, groups, title, currentRefinement, refine } = props;

    const setAvailability = useSearchState(
      (state) => state.setArtworkAvailabilities
    );

    const activeFiltersCount = length(items.filter((item) => item.isRefined));

    const [selected, setSelected] = useState(groups[0].title);

    // Handles updating the selected filter from the url param as stitches 0.1.9 doesnt play well with differeent styles
    useEffect(() => {
      const selected = groups.filter((group) => {
        return group.filters.some((filter) =>
          currentRefinement.includes(filter)
        );
      });

      setSelected(selected[0].title);
    }, []);

    // useEffect will fire infinitely when passed an array
    const refinementsAsString = currentRefinement.join(' ');

    useEffect(
      () => {
        setAvailability(currentRefinement);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [refinementsAsString]
    );

    const handleSelection = useCallback(
      (title: string) => {
        setSelected(title);
        const { filters } = groups.find((item) => item.title === title);

        refine(filters);
      },
      [setSelected, groups, refine]
    );

    return (
      <Grid css={{ gap: '$7' }}>
        <FilterHeading>{title}</FilterHeading>

        <Grid
          css={{
            gap: '$3',
            '@bp2': {
              gap: '$6',
            },
          }}
        >
          {groups.map((group) => (
            <Grid
              key={group.title}
              css={{ border: 'solid 2px $black5', borderRadius: '$2' }}
            >
              <CheckboxContainer
                css={{ margin: -2 }}
                onClick={() => handleSelection(group.title)}
              >
                <RadioCircle isActive={selected === group.title} />
                <FilterHeading
                  css={{ flex: 1, textAlign: 'left', marginLeft: '$3' }}
                >
                  {group.title}
                </FilterHeading>
              </CheckboxContainer>

              <FiltersGrid
                isVisible={selected === group.title && group.filtersVisible}
              >
                {group.filters.map((filter) => {
                  const hit = items.find((item) => item.label === filter);
                  const canRefineHit = activeFiltersCount > 1;

                  return (
                    <FilterCheckbox
                      key={filter}
                      hit={hit}
                      // we want to ensure at least
                      // one toggle is toggled at a time
                      canRefine={canRefineHit || !hit?.isRefined}
                      refine={refine}
                    />
                  );
                })}
              </FiltersGrid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
);

const FiltersGrid = styled(Grid, {
  gap: '$3',
  padding: '$3',
  display: 'none',
  variants: {
    isVisible: {
      true: {
        display: 'grid',
      },
    },
  },
});

interface FilterCheckboxProps {
  canRefine: boolean;
  hit: SearchResultHit;
  refine: (value: string | string[]) => void;
}

function FilterCheckbox(props: FilterCheckboxProps): JSX.Element {
  const { canRefine, hit, refine } = props;

  if (!hit) {
    return null;
  }

  return (
    <Box css={{ cursor: canRefine ? 'inherit' : 'not-allowed' }}>
      <Box
        style={{
          display: 'grid',
          pointerEvents: canRefine ? 'all' : 'none',
        }}
      >
        <AlgoliaCheckbox hit={hit} refine={refine} />
      </Box>
    </Box>
  );
}

export default GroupedRefinementFilters;

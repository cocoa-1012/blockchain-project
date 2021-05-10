import {
  connectRefinementList,
  connectToggleRefinement,
} from 'react-instantsearch-dom';
import { RefinementListProvided } from 'react-instantsearch-core';
import { indexOf, sort } from 'ramda';

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import AlgoliaCheckbox from 'components/forms/fields/algolia/AlgoliaCheckbox';

import { SearchResultHit } from 'types/Algolia';
import { isEmptyOrNil } from 'utils/helpers';

const sortRefinementItems = (
  items: RefinementListProvided['items'],
  sortOrder: string[]
) => {
  return sort((a: SearchResultHit, b: SearchResultHit) => {
    return indexOf(a.label, sortOrder) - indexOf(b.label, sortOrder);
  }, items);
};

const getRefinementItems = (
  items: RefinementListProvided['items'],
  sortOrder: string[]
): RefinementListProvided['items'] => {
  // if there’s no sort order
  return isEmptyOrNil(sortOrder)
    ? // return the items
      items
    : // otherwise sort the items
      sortRefinementItems(items, sortOrder);
};

type RefinementList = RefinementListProvided & {
  title: string;
  sortOrder?: string[];
};

const RefinementHeading = styled(Text, {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
});

const RefinementFilters = connectRefinementList<RefinementList>((props) => {
  const { items, title, sortOrder, refine } = props;

  const sortedItems = getRefinementItems(items, sortOrder);

  return (
    <Grid css={{ gap: '$7' }}>
      <Flex>
        <RefinementHeading>{title}</RefinementHeading>
      </Flex>

      <Grid css={{ gap: '$3' }}>
        {sortedItems.map((item) => (
          <AlgoliaCheckbox key={item.label} hit={item} refine={refine} />
        ))}
      </Grid>
    </Grid>
  );
});

export default RefinementFilters;

export const ToggleRefinement = connectToggleRefinement((props) => {
  const { currentRefinement, label, count, refine } = props;

  const algoliaCheckState: SearchResultHit = {
    ...props,
    count: currentRefinement ? count.checked : count.unchecked,
    currentRefinement,
    isRefined: currentRefinement,
    value: !currentRefinement,
    label,
  };

  return <AlgoliaCheckbox hit={algoliaCheckState} refine={refine} />;
});

type RefinementToggleFilter = {
  attribute: string;
  label: string;
  value: boolean;
  defaultRefinement: boolean;
};

interface RefinementToggleFiltersProps {
  filters: RefinementToggleFilter[];
  title: string;
}

export function RefinementToggleFilters(
  props: RefinementToggleFiltersProps
): JSX.Element {
  const { filters, title } = props;

  return (
    <Grid css={{ gap: '$7' }}>
      <Flex>
        <RefinementHeading>{title}</RefinementHeading>
      </Flex>

      <Grid css={{ gap: '$3' }}>
        {filters.map((item) => (
          <ToggleRefinement key={item.label} {...item} />
        ))}
      </Grid>
    </Grid>
  );
}

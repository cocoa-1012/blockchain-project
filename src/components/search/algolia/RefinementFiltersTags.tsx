import {
  connectRefinementList,
  connectToggleRefinement,
} from 'react-instantsearch-dom';
import { RefinementListProvided } from 'react-instantsearch-core';

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import AlgoliaCheckbox from 'components/forms/fields/algolia/AlgoliaCheckbox';

import { SearchResultHit } from 'types/Algolia';
import { notEmptyOrNil } from 'utils/helpers';
import TagFilter from './TagFilter';
import FilterSection from './FilterSection';

type RefinementList = RefinementListProvided & {
  title: string;
};

const RefinementHeading = styled(Text, {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
});

const RefinementFilters = connectRefinementList<RefinementList>((props) => {
  const { items, title, refine } = props;

  const filteredItems = items.filter((item) => item.isRefined);

  console.log({ items, filteredItems });

  const hasItems = notEmptyOrNil(filteredItems);

  if (hasItems) {
    return (
      <FilterSection>
        <Grid css={{ gap: '$7' }}>
          <Flex>
            <RefinementHeading>{title}</RefinementHeading>
          </Flex>

          <Grid css={{ gap: '$3' }}>
            {filteredItems.map((item) => (
              <TagFilter key={item.label} onClick={() => refine(item.value)}>
                {item.label}
              </TagFilter>
            ))}
          </Grid>
        </Grid>
      </FilterSection>
    );
  }

  return null;
});

export default RefinementFilters;

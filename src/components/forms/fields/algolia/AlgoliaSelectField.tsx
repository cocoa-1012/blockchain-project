import { connectSortBy } from 'react-instantsearch-dom';

import Text from 'components/base/Text';
import {
  SelectWrapper,
  Select,
  SelectIcon,
} from 'components/forms/fields/SelectField';

import DownIcon from 'assets/icons/down-chevron.svg';

interface SelectOption {
  value: string;
  label: string;
}

const AlgoliaSelectField = connectSortBy((props) => {
  const { items, currentRefinement, refine } = props;

  const activeOption = items.find((item) => item.value === currentRefinement);

  if (!currentRefinement || !activeOption) {
    return null;
  }

  const handleSort = (e) => {
    const value = e.target.value;
    refine(value);
  };

  return (
    <>
      <SelectWrapper css={{ minWidth: 220 }}>
        <Select onBlur={handleSort} onChange={handleSort}>
          {items.map((item: SelectOption, i: number) => (
            <option key={i} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Text>{activeOption.label}</Text>
        <SelectIcon css={{ marginLeft: 'auto' }}>
          <DownIcon width={15} />
        </SelectIcon>
      </SelectWrapper>
    </>
  );
});

export default AlgoliaSelectField;

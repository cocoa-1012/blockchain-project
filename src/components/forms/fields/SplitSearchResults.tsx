import { useField } from 'formik';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import SearchResultsGrid from 'components/search/SearchResultsGrid';
import SearchHitSplitUser from 'components/search/SearchHitSplitUser';
import SearchEmptyState from 'components/search/SearchEmptyState';
import SpinnerStroked from 'components/SpinnerStroked';

import { AlgoliaUser } from 'types/Algolia';
import { RevenueShare } from 'types/Share';

import { buildPercentToUse } from 'utils/split';
import { notEmptyOrNil } from 'utils/helpers';

interface SplitSearchResultsProps {
  results: AlgoliaUser[];
  handleClick: (arg0: RevenueShare) => void;
  isLoading: boolean;
}

export default function SplitSearchResults(
  props: SplitSearchResultsProps
): JSX.Element {
  const { results, handleClick, isLoading } = props;

  const hasResults = notEmptyOrNil(results);

  return (
    <Box
      css={{
        position: 'absolute',
        top: 'calc(100% + $5)',
        boxShadow: '$2',
        zIndex: 999,
        width: '100%',
        marginBottom: '$8',
        borderRadius: '$2',
        overflow: 'hidden',
      }}
    >
      <Box css={{ maxHeight: 480, overflow: 'scroll' }}>
        <SearchResultsGrid css={{ boxShadow: 'none' }}>
          <Text
            css={{
              color: '$black50',
              fontWeight: 600,
              fontFamily: '$body',
            }}
          >
            People
          </Text>

          {isLoading ? (
            <Flex center css={{ minHeight: 340 }}>
              <SpinnerStroked size={32} />
            </Flex>
          ) : hasResults ? (
            <SearchResultsList results={results} handleClick={handleClick} />
          ) : (
            <Flex center css={{ minHeight: 340 }}>
              <SearchEmptyState
                headingSize="$3"
                heading="No results found."
                description="No one by that username was found."
              />
            </Flex>
          )}
        </SearchResultsGrid>
      </Box>
    </Box>
  );
}

type SearchResultsListProps = Omit<SplitSearchResultsProps, 'isLoading'>;

function SearchResultsList(props: SearchResultsListProps): JSX.Element {
  const { results, handleClick } = props;

  const [field] = useField<RevenueShare[]>('shares');

  const shares: RevenueShare[] = field.value;

  return (
    <>
      {results.map((result) => (
        <Box
          css={{ cursor: 'pointer' }}
          key={result.publicKey}
          onClick={() => {
            handleClick({
              address: result.publicKey,
              shareInPercentage: buildPercentToUse(shares.length + 1),
            });
          }}
        >
          <SearchHitSplitUser hit={result} />
        </Box>
      ))}
    </>
  );
}

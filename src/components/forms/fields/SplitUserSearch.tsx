import { useCallback, useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import useAlgolia from 'use-algolia';
import { uniqBy, prop } from 'ramda';
import { useClickAway } from 'react-use';

import Box from 'components/base/Box';
import Input from 'components/base/Input';
import Icon from 'components/Icon';
import SearchBarIcon from 'components/search/search-result/SearchBarIcon';
import SplitSearchResults from 'components/forms/fields/SplitSearchResults';
import { ValidationStates } from 'components/forms/FieldMeta';

import SearchIcon from 'assets/icons/search-icon.svg';

import type { AlgoliaUser } from 'types/Algolia';
import type { RevenueShare } from 'types/Share';

import { stripAtSymbol } from 'utils/strings';
import { buildPercentToUse } from 'utils/split';
import { isETHAddress, notEmptyOrNil } from 'utils/helpers';
import { MAX_SPLIT_RECIPIENT_COUNT } from 'lib/constants';

// formats list of publicKeys to be:
// `NOT objectId:0xtest AND NOT objectId:0xbeef`
function buildFilterClause(
  currentUserPublicKey: string,
  users: RevenueShare[]
) {
  return [...users.map((user) => user.address), currentUserPublicKey]
    .map((publicKey) => `NOT objectID:${publicKey}`)
    .join(' AND ');
}

interface SplitUserSearchProps {
  publicAddress: string;
}

export default function SplitUserSearch(
  props: SplitUserSearchProps
): JSX.Element {
  const { publicAddress } = props;

  const [field, , helpers] = useField<RevenueShare[]>('shares');

  const [currentValue, setCurrentValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isCurrentValueAddress = isETHAddress(currentValue);

  const ref = useRef();

  const hasMaxRecipients = MAX_SPLIT_RECIPIENT_COUNT <= field.value.length;

  const hasSearchValue = notEmptyOrNil(currentValue);

  const [searchState, requestDispatch] = useAlgolia<AlgoliaUser>(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
    'users'
  );

  const filterClause = buildFilterClause(publicAddress, field.value);

  useEffect(
    () => {
      requestDispatch({
        query: stripAtSymbol(currentValue),
        filters: filterClause,
        hitsPerPage: 50,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        facetFilters: [
          'moderationStatus:ACTIVE',
          'isHidden:false',
          [
            'socialVerificationFacet:INSTAGRAM',
            'socialVerificationFacet:TWITTER',
          ],
        ],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentValue, requestDispatch]
  );

  const addSplitValue = useCallback(
    (shareData: RevenueShare) => {
      const shares = field.value;

      // just in case the user pastes the same address twice, force uniqueness
      const uniqResults = uniqBy(prop('address'), [...shares, shareData]);

      if (uniqResults.length <= MAX_SPLIT_RECIPIENT_COUNT) {
        // map over unique share results vs. results passed in
        const currentResults = uniqResults.map((share, index) => ({
          ...share,
          // uniqResults.length includes the new addition
          shareInPercentage: buildPercentToUse(uniqResults.length, index),
        }));
        helpers.setValue(currentResults);
      }
      setCurrentValue('');
    },
    [helpers, field, setCurrentValue]
  );

  const handleChange = useCallback(
    (value: string) => {
      const shares = field.value;
      const isPublicKey = isETHAddress(value);
      if (isPublicKey) {
        setCurrentValue(value);
        setTimeout(() => {
          addSplitValue({
            shareInPercentage: buildPercentToUse(shares.length + 1),
            address: value,
          });
        }, 1000);
      } else {
        setCurrentValue(value);
      }
    },
    [setCurrentValue, addSplitValue, field.value]
  );

  useClickAway(ref, () => {
    setIsFocused(false);
  });

  const resultsVisible = isFocused && hasSearchValue && !isCurrentValueAddress;

  return (
    <Box css={{ position: 'relative' }} ref={ref}>
      <SearchBarIcon
        css={{ left: 20, pointerEvents: 'none' }}
        data-active={isFocused}
        color="black"
      >
        <Icon icon={SearchIcon} width={18} height={18} />
      </SearchBarIcon>

      <Input
        disabled={hasMaxRecipients}
        css={{
          width: '100%',
          transitionDuration: '$3',
          transitionTimingFunction: '$ease',
          transitionProperty: 'background-color, color, box-shadow, border',
          paddingLeft: '$8',
          border: 'none',
        }}
        color="white"
        size="large"
        placeholder="Enter a username or Ethereum address…"
        value={currentValue}
        onFocus={() => setIsFocused(true)}
        onChange={(ev) => {
          handleChange(ev.target.value);
        }}
        onPaste={(ev) => {
          const pastedText = ev.clipboardData.getData('Text');
          handleChange(pastedText);
        }}
      />

      {isCurrentValueAddress && <ValidationStates isValid={true} />}

      {resultsVisible && (
        <SplitSearchResults
          results={searchState.hits ?? []}
          handleClick={addSplitValue}
          isLoading={searchState.loading}
        />
      )}
    </Box>
  );
}

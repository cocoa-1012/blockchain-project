import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import { useRouter } from 'next/router';

import { styled } from 'stitches.config';

import searchClient from 'lib/clients/algolia';

import Box from 'components/base/Box';
import ConnectedSearchBox from './ConnectedSearchBox';
import SearchBarResults from './SearchBarResults';
import SearchBarOverlay from './SearchBarOverlay';

import { notEmptyOrNil } from 'utils/helpers';

import { PageColorMode } from 'types/page';

const SearchContainer = styled(Box, {
  flex: 1,
  justifyContent: 'center',
  position: 'relative',
  '@bp1': {
    paddingLeft: '$7',
    paddingRight: '$7',
  },
});

interface SearchBarProps {
  pageColorMode: PageColorMode;
  searchOpen: boolean;
}

export default function SearchBar(props: SearchBarProps): JSX.Element {
  const { pageColorMode, searchOpen } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [currentValue, setCurrentValue] = useState('');

  const router = useRouter();

  useEffect(() => {
    setIsFocused(false);
  }, [router.asPath]);

  const hasValue = notEmptyOrNil(currentValue);

  const ref = useRef(null);

  useClickAway(ref, () => {
    setIsFocused(false);
  });

  return (
    <InstantSearch searchClient={searchClient} indexName="users">
      <Configure hitsPerPage={3} />
      <SearchContainer
        ref={ref}
        className="header-search-bar"
        css={{
          display: searchOpen ? 'block' : 'none',
          '@bp1': {
            display: 'block',
          },
          '.creator-flow &': {
            display: 'none',
          },
        }}
      >
        <ConnectedSearchBox
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          placeholder="Search Foundation…"
          onChange={setCurrentValue}
          colorMode={pageColorMode}
          searchOpen={searchOpen}
        />

        <Box css={{ position: 'relative' }}>
          {isFocused && hasValue && <SearchBarResults />}
        </Box>
      </SearchContainer>
      <SearchBarOverlay
        css={{
          opacity: isFocused ? 1 : 0,
          pointerEvents: isFocused ? 'all' : 'none',
          display: 'none',
          '@bp1': {
            display: 'block',
          },
        }}
      />
    </InstantSearch>
  );
}

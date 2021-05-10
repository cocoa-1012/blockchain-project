import { createConnector } from 'react-instantsearch-dom';
import { useCallback, useEffect, useRef } from 'react';
import { useKeyPress } from 'react-use';

import Box from 'components/base/Box';
import Input from 'components/base/Input';
import SearchBarIcon from './search-result/SearchBarIcon';

import SearchIcon from 'assets/icons/search-icon.svg';
import CloseIcon from 'assets/icons/close-icon.svg';

import { notEmptyOrNil } from 'utils/helpers';
import { PageColorMode } from 'types/page';

const connectWithQuery = createConnector({
  displayName: 'WidgetWithQuery',
  getProvidedProps(props, searchState) {
    // Since the `attributeForMyQuery` searchState entry isn't
    // necessarily defined, we need to default its value.
    const currentRefinement = searchState.attributeForMyQuery || '';

    // Connect the underlying component with the `currentRefinement`
    return { currentRefinement };
  },
  refine(props, searchState, nextRefinement) {
    // When the underlying component calls its `refine` prop,
    // we update the searchState with the provided refinement.
    return {
      // `searchState` represents the search state of *all* widgets. We need to extend it
      // instead of replacing it, otherwise other widgets will lose their respective state.
      ...searchState,
      attributeForMyQuery: nextRefinement,
    };
  },
  getSearchParameters(searchParameters, props, searchState) {
    // When the `attributeForMyQuery` state entry changes, we update the query
    return searchParameters.setQuery(searchState.attributeForMyQuery || '');
  },
  cleanUp(props, searchState) {
    // When the widget is unmounted, we omit the entry `attributeForMyQuery`
    // from the `searchState`, then on the next request the query will
    // be empty
    const { attributeForMyQuery, ...nextSearchState } = searchState;

    return nextSearchState;
  },
});

interface SearchBoxProps {
  currentRefinement: string;
  refine: (value: string) => void;
  onChange: (value: string) => void;
  setIsFocused: (arg0: boolean) => void;
  placeholder: string;
  isFocused: boolean;
  colorMode: PageColorMode;
  searchOpen: boolean;
}

function SearchBox(props: SearchBoxProps): JSX.Element {
  const {
    refine,
    onChange,
    setIsFocused,
    currentRefinement,
    placeholder,
    isFocused,
    colorMode,
    searchOpen,
  } = props;

  const hasValue = notEmptyOrNil(currentRefinement);

  const focusRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (value: string) => {
      refine(value);
      onChange(value);
    },
    [refine, onChange]
  );

  useEffect(() => {
    if (searchOpen) {
      focusRef?.current?.focus();
    }
  }, [searchOpen]);

  const resetSearch = () => {
    handleChange('');
    focusRef?.current?.focus();
  };

  const isEscapePressed = useKeyPress('Escape');

  useEffect(() => {
    if (isEscapePressed) {
      focusRef?.current?.blur();
      setIsFocused(false);
    }
  }, [isEscapePressed, setIsFocused]);

  const iconMode = colorMode === PageColorMode.dark ? 'white' : 'black';

  return (
    <Box css={{ position: 'relative', zIndex: 999 }}>
      <SearchBarIcon
        css={{ left: 20, pointerEvents: 'none' }}
        color={iconMode}
        data-active={isFocused}
      >
        <SearchIcon width={18} height={18} style={{ display: 'block' }} />
      </SearchBarIcon>
      <Input
        css={{ border: 'none', width: '100%', paddingLeft: '$8' }}
        data-active={isFocused}
        size="large"
        color={colorMode === PageColorMode.dark ? 'translucent' : 'white'}
        value={currentRefinement}
        onChange={(ev) => handleChange(ev.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        ref={focusRef}
      />
      {isFocused && hasValue && (
        <SearchBarIcon
          color={iconMode}
          css={{ right: 20 }}
          onClick={resetSearch}
          focused={isFocused}
        >
          <CloseIcon width={14} height={14} style={{ display: 'block' }} />
        </SearchBarIcon>
      )}
    </Box>
  );
}

const ConnectedSearchBox = connectWithQuery(SearchBox);

export default ConnectedSearchBox;

/* eslint-disable react/jsx-max-depth */
import { ReactNode, useEffect } from 'react';
// import { useLockBodyScroll, useMeasure } from 'react-use';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Button from 'components/base/Button';

import MobileHeaderOpenButton from 'components/headers/MobileHeaderOpenButton';
import {
  FilterOverlayInner,
  FilterOverlayOuter,
} from 'components/search/SearchFilterOverlay';

interface ArtworkSearchFiltersStackedProps {
  isOpen: boolean;
  closeSearch: () => void;
  filters: ReactNode[];
}

export default function ArtworkSearchFiltersStacked(
  props: ArtworkSearchFiltersStackedProps
): JSX.Element {
  const { isOpen, closeSearch, filters } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isOpen) {
      document.body.classList.add('body-fixed');
    } else {
      document.body.classList.remove('body-fixed');
    }
  }, [isOpen]);

  useEffect(() => document.body.classList.remove('body-fixed'), []);

  return (
    <FilterOverlayOuter isOpen={isOpen}>
      <FilterOverlayInner>
        <Flex
          css={{
            height: '100%',
            overflowY: 'auto',
            flexDirection: 'column',
          }}
        >
          <Box css={{ paddingX: '$6' }}>
            <Flex
              css={{
                borderBottom: 'solid 1px $black10',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '$6',
                paddingBottom: '$6',
              }}
            >
              <Text
                css={{
                  fontSize: '$3',
                  fontWeight: 600,
                  fontFamily: '$body',
                }}
                onClick={closeSearch}
              >
                Filters
              </Text>
              <MobileHeaderOpenButton isOpen={isOpen} setOpen={closeSearch} />
            </Flex>
          </Box>

          <Box css={{ flex: 1 }}>
            {filters.map((filter, key) => (
              <Box key={key} css={{ paddingX: '$6' }}>
                <Box
                  className="filter-box"
                  css={{
                    paddingBottom: '$7',
                    paddingTop: '$6',
                    borderBottom:
                      key < filters.length - 1 ? 'solid 1px $black10' : 'none',
                  }}
                >
                  {filter}
                </Box>
              </Box>
            ))}
          </Box>
        </Flex>

        <ApplyFilters onApply={closeSearch} />
      </FilterOverlayInner>
    </FilterOverlayOuter>
  );
}

interface ApplyFiltersProps {
  onApply: () => void;
}

function ApplyFilters(props: ApplyFiltersProps): JSX.Element {
  const { onApply } = props;

  return (
    <Box
      css={{
        padding: '$6',
        boxShadow: '0px -10px 20px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        bottom: 0,
        left: 0,
        backgroundColor: '$white100',
        borderRadius: '$2',
      }}
    >
      <Button
        color="black"
        size="large"
        shape="regular"
        onClick={onApply}
        css={{ width: '100%' }}
      >
        Save
      </Button>
    </Box>
  );
}

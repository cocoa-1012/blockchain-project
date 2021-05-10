import { styled } from 'stitches.config';

import Button from 'components/base/Button';

import { TimeFilter } from 'types/Trending';

export const Chiclet = styled(Button, {
  fontSize: '$1',
  paddingX: '$2',
  paddingY: '$1',
  minHeight: 'auto',
  borderRadius: 6,
  backgroundColor: 'transparent',
  color: '$black60',
  cursor: 'pointer',
  '@media (hover: hover)': {
    '&:hover': {
      color: '$white100',
      backgroundColor: '$black100',
      transform: 'translateY(-2px)',
      boxShadow: '$2',
    },
  },

  variants: {
    isActive: {
      true: {
        color: '$white100',
        backgroundColor: '$black100',
        '&:hover': {
          transform: 'translateY(0)',
          boxShadow: 'none',
        },
      },
    },
  },
});

interface TrendingTimeFiltersProps {
  setCurrentTimeFilter: (currentTimeFilter: TimeFilter) => void;
  currentTimeFilter: TimeFilter;
}

export default function TrendingTimeFilters(
  props: TrendingTimeFiltersProps
): JSX.Element {
  const { setCurrentTimeFilter, currentTimeFilter } = props;

  return (
    <>
      <Chiclet
        onClick={() => setCurrentTimeFilter(TimeFilter.OneDay)}
        isActive={currentTimeFilter === TimeFilter.OneDay}
      >
        1d
      </Chiclet>
      <Chiclet
        css={{ marginLeft: '$2' }}
        onClick={() => setCurrentTimeFilter(TimeFilter.SevenDay)}
        isActive={currentTimeFilter === TimeFilter.SevenDay}
      >
        7d
      </Chiclet>
      <Chiclet
        css={{ marginLeft: '$2' }}
        onClick={() => setCurrentTimeFilter(TimeFilter.ThirtyDay)}
        isActive={currentTimeFilter === TimeFilter.ThirtyDay}
      >
        30d
      </Chiclet>
      <Chiclet
        css={{ marginLeft: '$2' }}
        onClick={() => setCurrentTimeFilter(TimeFilter.AllTime)}
        isActive={currentTimeFilter === TimeFilter.AllTime}
      >
        All Time
      </Chiclet>
    </>
  );
}

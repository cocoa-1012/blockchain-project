import TabHeading from 'components/tabs/TabHeading';
import TabBar from 'components/tabs/TabBar';

import Flex from 'components/base/Flex';

import { TabsProps } from 'types/Tabs';
import { TimeFilter } from 'types/Trending';
import TrendingTimeFilters from './TrendingTimeFilters';

interface TrendingTabsProps<T> extends TabsProps<T> {
  isLoading: boolean;
  currentTimeFilter: TimeFilter;
  setCurrentTimeFilter: (currentTimeFilter: TimeFilter) => void;
}

export default function TrendingTabs<T extends string | number>(
  props: TrendingTabsProps<T>
): JSX.Element {
  const {
    setCurrentView,
    currentView,
    tabs,
    currentTimeFilter,
    setCurrentTimeFilter,
  } = props;

  return (
    <TabBar
      css={{
        marginBottom: '$4',
      }}
    >
      {tabs.map((tab) => (
        <TabHeading
          key={tab}
          isActive={currentView === tab}
          onClick={() => setCurrentView(tab)}
        >
          {tab}
        </TabHeading>
      ))}
      <Flex
        css={{
          marginLeft: 'auto',
          alignSelf: 'flex-start',
          display: 'none',
          '@bp1': { display: 'flex' },
        }}
      >
        <TrendingTimeFilters
          setCurrentTimeFilter={setCurrentTimeFilter}
          currentTimeFilter={currentTimeFilter}
        />
      </Flex>
    </TabBar>
  );
}

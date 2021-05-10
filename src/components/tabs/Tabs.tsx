import { ReactNode } from 'react';

import TabHeading from './TabHeading';
import TabBar from './TabBar';

import { TabsProps } from 'types/Tabs';

export default function Tabs<T extends string | number>(
  props: TabsProps<T>
): JSX.Element {
  const { setCurrentView, currentView, tabs } = props;

  return (
    <TabBar>
      {tabs.map((tab) => (
        <TabHeading
          key={tab}
          isActive={currentView === tab}
          onClick={() => setCurrentView(tab)}
        >
          {tab}
        </TabHeading>
      ))}
    </TabBar>
  );
}

interface TabsWithLabelsProps<T, U> {
  currentView: U;
  setCurrentView: (arg1: string) => void;
  tabs: T[];
}

export interface Tab {
  label: ReactNode;
  value: string;
  className?: string;
}

export function TabsWithLabels<T extends Tab, U extends string>(
  props: TabsWithLabelsProps<T, U>
): JSX.Element {
  const { setCurrentView, currentView, tabs } = props;

  return (
    <TabBar>
      {tabs.map((tab) => (
        <TabHeading
          className={tab.className}
          key={tab.value}
          isActive={currentView === tab.value}
          onClick={() => setCurrentView(tab.value)}
        >
          {tab.label}
        </TabHeading>
      ))}
    </TabBar>
  );
}

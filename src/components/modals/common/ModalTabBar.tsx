/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { css } from 'stitches.config';

import ModalCloseButton from 'components/modals/ModalCloseButton';
import TabBar from 'components/tabs/TabBar';
import TabHeading from 'components/tabs/TabHeading';

type ModalTab = {
  onClick: () => void;
  isActive: boolean;
  children: string;
};

interface ModalTabsProps {
  tabs: ModalTab[];
}

export default function ModalTabs(props: ModalTabsProps): JSX.Element {
  const { tabs } = props;

  return (
    <TabBar className={tabsStyles()}>
      <Flex sx={{ alignItems: 'center', flex: 1, paddingTop: 'm' }}>
        {tabs.map((tab, index) => (
          <TabHeading key={index} {...tab} />
        ))}
      </Flex>
      <ModalCloseButton />
    </TabBar>
  );
}

const tabsStyles = css({
  display: 'flex',
  borderBottom: 'solid 1px $black10',
  alignItems: 'center',
  paddingLeft: '$6',
  paddingRight: '$5',
  marginBottom: 1,
  $bp1: { paddingLeft: '$7' },
});

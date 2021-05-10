/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, ThemeUIStyleObject } from 'theme-ui';
import { head, last } from 'ramda';

import Account from 'types/Account';
import HistoryEventAvatar from './HistoryEventAvatar';

interface HistoryEventAvatarsProps {
  users: Account[];
  className?: string;
}

export default function HistoryEventAvatars(
  props: HistoryEventAvatarsProps
): JSX.Element {
  const { users } = props;

  const sx = getStyles();

  const transferredFrom = head(users);
  const transferredTo = last(users);

  return (
    <Flex sx={sx.avatars}>
      <HistoryEventAvatar
        user={transferredFrom}
        sx={{ zIndex: 2, marginRight: [0, -12], marginBottom: [-12, 0] }}
      />
      <HistoryEventAvatar
        user={transferredTo}
        sx={{ zIndex: 1, marginRight: [0, 's'] }}
      />
    </Flex>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    flex: 1,
    alignItems: 'center',
  };
  const avatars: ThemeUIStyleObject = {
    flexDirection: ['column', 'row'],
    flexShrink: 0,
    marginRight: ['s', 0],
  };
  return { container, avatars };
};

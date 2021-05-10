/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';

import { ModalMode } from 'types/modal';

interface FollowsEmptyState {
  modalMode: ModalMode;
}

export default function FollowsEmptyState(
  props: FollowsEmptyState
): JSX.Element {
  const { modalMode } = props;
  if (modalMode === ModalMode.Following) {
    return (
      <Text variant="body.body" sx={{ margin: 'auto' }}>
        This user isn’t following anyone.
      </Text>
    );
  }
  if (modalMode === ModalMode.Followers) {
    return (
      <Text variant="body.body" sx={{ margin: 'auto' }}>
        This user does not have any followers.
      </Text>
    );
  }
  return null;
}

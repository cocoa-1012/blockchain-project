/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, ThemeUIStyleObject } from 'theme-ui';
import { useCallback, useEffect, useRef } from 'react';
import { useVirtual } from 'react-virtual';
import { last } from 'ramda';
import { useBreakpointIndex } from '@theme-ui/match-media';

import ModalRowVirtualized from './ModalRowVirtualized';
import { getFirstValue } from 'utils/helpers';

import Account, { AccountFeed, Collector } from 'types/Account';
import { ModalMode } from 'types/modal';
import Follow from 'types/Follow';

interface ModalPaneVirtualizedProps<T> {
  users: T[];
  modalMode?: ModalMode;
  handleNextPage: () => void;
  isFetchingNextPage: string | boolean;
  hasNextPage: boolean;
  onFollowUpdate: () => void;
}

type ModalUser = {
  follows: Follow[];
};

export default function ModalPaneVirtualized<T extends ModalUser>(
  props: ModalPaneVirtualizedProps<T>
): JSX.Element {
  const {
    users,
    handleNextPage,
    isFetchingNextPage,
    hasNextPage,
    onFollowUpdate,
    modalMode,
  } = props;

  const sx = getStyles();

  const breakpointIndex = useBreakpointIndex({ defaultIndex: 2 });

  const parentRef = useRef();

  const isMobileBreakpoint = breakpointIndex <= 0;

  // set the row size to 67px on mobile and 105px otherwise
  const estimateSize = useCallback(() => (isMobileBreakpoint ? 60 : 105), [
    isMobileBreakpoint,
  ]);

  const rowVirtualizer = useVirtual({
    size: users.length,
    parentRef,
    // height of the individual elements
    estimateSize,
    // buffer to keep extra items below the fold
    overscan: 20,
  });

  // this useEffect fires as we scroll
  useEffect(
    () => {
      // get the last element from the virtual scroll
      const lastItem = last(rowVirtualizer.virtualItems);

      if (!lastItem) {
        return;
      }

      // when the last element is appended to the virtual scroll
      const isLastItem = lastItem.index === users.length - 1;

      // we then fire a request to get the next page
      if (isLastItem && hasNextPage && !isFetchingNextPage) {
        handleNextPage();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users.length, rowVirtualizer.virtualItems, isFetchingNextPage]
  );

  // when changing tabs in the modal, scroll results to the top
  useEffect(
    () => {
      rowVirtualizer.scrollToIndex(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modalMode]
  );

  return (
    <Box ref={parentRef} sx={sx.container}>
      <Box
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const userRow = users[virtualRow.index];

          const initialFollowState: Follow = getFirstValue(userRow?.follows);

          console.log({ userRow });

          return (
            <Box
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'flex',
              }}
            >
              <ModalRowVirtualized
                user={userRow}
                isFollowing={initialFollowState?.isFollowing}
                onFollowUpdate={onFollowUpdate}
                isLoading={false}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    paddingX: [0, 'm'],
    paddingBottom: ['s', 'm'],
    paddingTop: ['s', 'm'],
    maxWidth: 760,
    // desired height minus the header height
    minHeight: 640 - 66,
    maxHeight: 640 - 66,
    overflow: 'auto',
    position: 'relative',
  };
  return { container };
};

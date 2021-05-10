/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { compose, flatten, isEmpty, prop, uniqBy } from 'ramda';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

import { ModalKey, ModalMode } from 'types/modal';
import { UserFollow } from 'types/Follow';
import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

import useAuthToken from 'hooks/queries/use-auth-token';
import usePagination from 'hooks/use-pagination';
import useFollowing from 'hooks/queries/hasura/use-following';
import useFollowers from 'hooks/queries/hasura/use-followers';
import useModal from 'hooks/use-modal';

import FollowsEmptyState from 'components/follows/FollowsEmptyState';
import LoadingPage from 'components/LoadingPage';
import ModalContainer from 'components/modals/common/ModalContainer';
import ModalTabs from 'components/modals/common/ModalTabBar';
import ModalContentVirtualized from 'components/modals/virtualized/ModalContentVirtualized';
import ModalPaneVirtualized from 'components/modals/virtualized/ModalPaneVirtualized';

const getUniqueFollows = compose<UserFollow[][], UserFollow[], UserFollow[]>(
  uniqBy(prop('id')),
  flatten
);

export default function FollowsModal(): JSX.Element {
  const queryClient = useQueryClient();

  const {
    modalEntity: publicKey,
    currentModal,
    modalMode,
    setModalMode,
  } = useModal();

  const { user } = useAuthToken();

  const isModalOpen = currentModal === ModalKey.FOLLOWS;

  const modalHook =
    modalMode === ModalMode.Following ? useFollowing : useFollowers;

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
  } = modalHook({
    publicKey,
    currentUserPublicKey: user?.publicAddress,
    enabled: isModalOpen,
  });

  const followedUsers = getUniqueFollows(data?.pages ?? []);

  const users = followedUsers.map((follow) => follow.user);

  const { handleNextPage, setCurrentPage } = usePagination({
    fetchNextPage,
    isFetching,
    hasNextPage,
  });

  // reset the infinite scroll to 0 when the modal changes
  useEffect(
    () => {
      setCurrentPage(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentModal, modalMode]
  );

  const noResults = isEmpty(followedUsers);

  return (
    <ModalContainer modalKey={ModalKey.FOLLOWS}>
      <ModalContentVirtualized>
        <ModalTabs
          tabs={[
            {
              onClick: () => setModalMode(ModalMode.Following),
              isActive: modalMode === ModalMode.Following,
              children: 'Following',
            },
            {
              onClick: () => setModalMode(ModalMode.Followers),
              isActive: modalMode === ModalMode.Followers,
              children: 'Followers',
            },
          ]}
        />

        {isLoading ? (
          <LoadingPage sx={{ paddingBottom: [0, 0, 0] }} />
        ) : noResults ? (
          <FollowsEmptyState modalMode={modalMode} />
        ) : (
          <ModalPaneVirtualized<AccountFeed>
            modalMode={modalMode}
            users={users}
            handleNextPage={handleNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onFollowUpdate={() => {
              const queryKey =
                modalMode === ModalMode.Followers
                  ? QueryCacheKey.UserFollowers
                  : QueryCacheKey.UserFollowing;

              queryClient.invalidateQueries(queryKey);
            }}
          />
        )}
      </ModalContentVirtualized>
    </ModalContainer>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { compose, flatten, isEmpty, propOr, uniqBy } from 'ramda';
import { InfiniteData, useQueryClient } from 'react-query';

import { ModalKey } from 'types/modal';
import { Collector } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

import usePagination from 'hooks/use-pagination';
import useProfileCollectors from 'hooks/queries/subgraph/use-profile-collectors';

import ModalContentVirtualized from 'components/modals/virtualized/ModalContentVirtualized';
import ModalContainer from 'components/modals/common/ModalContainer';
import ModalPaneVirtualized from 'components/modals/virtualized/ModalPaneVirtualized';
import ModalTabs from 'components/modals/common/ModalTabBar';
import LoadingPage from 'components/LoadingPage';

import useModal from 'hooks/use-modal';

const getCollectors = compose<
  InfiniteData<Collector[]>,
  Collector[][],
  Collector[],
  Collector[]
>(
  uniqBy((c) => c.publicKey),
  flatten,
  propOr([], 'pages')
);
interface CollectorsModalProps {
  publicKey: string;
  currentUserPublicKey: string;
}

export default function CollectorsModal(
  props: CollectorsModalProps
): JSX.Element {
  const { publicKey, currentUserPublicKey } = props;

  const { currentModal } = useModal();

  const queryClient = useQueryClient();

  const isModalOpen = currentModal === ModalKey.COLLECTORS;

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
  } = useProfileCollectors({
    publicKey,
    currentUserPublicKey,
    enabled: isModalOpen,
  });

  const collectors = getCollectors(data);

  const { handleNextPage } = usePagination({
    fetchNextPage,
    isFetching,
    hasNextPage,
  });

  const noResults = isEmpty(collectors);

  return (
    <ModalContainer modalKey={ModalKey.COLLECTORS}>
      <ModalContentVirtualized>
        <ModalTabs
          tabs={[
            {
              onClick: () => void 0,
              isActive: true,
              children: 'Collected by',
            },
          ]}
        />

        {isLoading ? (
          <LoadingPage sx={{ paddingBottom: [0, 0, 0] }} />
        ) : noResults ? (
          <Text variant="body.body" sx={{ margin: 'auto' }}>
            This user has no collectors.
          </Text>
        ) : (
          <ModalPaneVirtualized<Collector>
            users={collectors}
            handleNextPage={handleNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onFollowUpdate={() => {
              queryClient.invalidateQueries(QueryCacheKey.ProfileCollectors);
            }}
          />
        )}
      </ModalContentVirtualized>
    </ModalContainer>
  );
}

/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject } from 'theme-ui';
import { flatten } from 'ramda';
import { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from 'react-query';

import Page from 'components/Page';
import Body from 'components/Body';
import CreatorResults from 'components/feed/CreatorResults';

import useAuthToken from 'hooks/queries/use-auth-token';
import useCreatorsByNetSales from 'hooks/queries/subgraph/use-creators-by-net-sales';

import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

export default function Creators(): JSX.Element {
  const { user } = useAuthToken();

  const queryClient = useQueryClient();

  const publicAddress = user?.publicAddress;

  const [currentPage, setCurrentPage] = useState<number>(0);

  const sx = getStyles();

  const {
    data: creatorsData,
    fetchNextPage,
    isLoading: creatorsLoading,
    isFetching,
  } = useCreatorsByNetSales({
    publicKey: publicAddress,
  });

  const handleFetchMore = useCallback(() => {
    if (isFetching) {
      return;
    }
    if (currentPage > 0) {
      fetchNextPage();
    }
  }, [currentPage, fetchNextPage, isFetching]);

  useEffect(
    () => {
      handleFetchMore();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage]
  );

  const handleNextPage = useCallback(() => {
    setCurrentPage((currentPage) => currentPage + 1);
  }, []);

  const flattenedCreators: AccountFeed[] = flatten(
    creatorsData?.pages ?? [] ?? []
  );

  return (
    <Page title="Creators">
      <Body sx={sx.body}>
        <CreatorResults
          publicAddress={publicAddress}
          handleNextPage={handleNextPage}
          creators={flattenedCreators}
          noMoreResults={false}
          isLoading={creatorsLoading}
          isFetching={isFetching}
          enableHeader={false}
          onFollowUpdate={() => {
            queryClient.invalidateQueries(
              QueryCacheKey.FollowsByUserPublicKeys
            );
          }}
        />
      </Body>
    </Page>
  );
}

const getStyles = () => {
  const body: ThemeUIStyleObject = {
    position: 'relative',
    zIndex: 4,
    paddingTop: [0, 0, 'xxl'],
    flexShrink: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const filters: ThemeUIStyleObject = {
    marginBottom: 'm',
    borderBottom: 'solid 1px',
    borderColor: 'black.100',
    paddingBottom: 's',
  };

  const input: ThemeUIStyleObject = {
    borderWidth: 'solid 3px',
    borderRadius: 999,
    minHeight: 56,
    backgroundImage: 'url(/images/icons/search-icon.svg)',
    backgroundSize: '19px 19px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '20px center',
    paddingLeft: 52,
    fontSize: 'xs',
    '&::placeholder': {
      fontWeight: 500,
    },
  };

  return { body, filters, input };
};

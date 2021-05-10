/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { useQueryClient } from 'react-query';

import useWorldCreators from 'hooks/queries/hasura/use-world-creators';

import CreatorResults from 'components/feed/CreatorResults';

import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

import { getCreators } from 'utils/users';
import { sortCreatorsByPublicKeys } from 'utils/creator';

interface FeaturedWorldCreatorsProps {
  publicAddress: string;
  creatorIds: string[];
  world: string;
}

export default function FeaturedWorldCreators(
  props: FeaturedWorldCreatorsProps
): JSX.Element {
  const { publicAddress, creatorIds, world } = props;

  const queryClient = useQueryClient();

  const onFollowUpdate = () => {
    queryClient.invalidateQueries(QueryCacheKey.WorldCreators);
    queryClient.invalidateQueries(QueryCacheKey.UserFollowCounts);
    queryClient.invalidateQueries(QueryCacheKey.FollowsByUserPublicKeys);
  };

  const { data: creatorsData, isLoading: creatorsLoading } = useWorldCreators({
    publicKey: publicAddress,
    userIds: creatorIds,
    world,
  });

  // creators come back in ID order from the server (newest first)
  const creators: AccountFeed[] = getCreators(creatorsData?.pages ?? []);

  // here we re-sort them according to the contentful custom order
  const sortedCreators: AccountFeed[] = sortCreatorsByPublicKeys(
    creatorIds,
    creators
  );

  return (
    <Grid gap="l">
      <CreatorResults
        publicAddress={publicAddress}
        isFetching={false}
        isLoading={creatorsLoading}
        creators={sortedCreators}
        handleNextPage={() => void 0}
        enableHeader={false}
        onFollowUpdate={onFollowUpdate}
        noMoreResults={true}
      />
    </Grid>
  );
}

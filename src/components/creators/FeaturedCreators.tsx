/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { useQueryClient } from 'react-query';

import useCreatorsFeed from 'hooks/queries/hasura/use-creators-feed';

import CreatorResults from 'components/feed/CreatorResults';
import HomePageButton from 'components/buttons/HomePageButton';

import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

import { getCreators } from 'utils/users';
import { sortCreatorsByPublicKeys } from 'utils/creator';

interface FeaturedCreatorsProps {
  publicAddress: string;
  creatorIds: string[];
}

export default function FeaturedCreators(
  props: FeaturedCreatorsProps
): JSX.Element {
  const { publicAddress, creatorIds } = props;

  const queryClient = useQueryClient();

  const onFollowUpdate = () => {
    queryClient.invalidateQueries(QueryCacheKey.FeedFeaturedCreators);
    queryClient.invalidateQueries(QueryCacheKey.UserFollowCounts);
    queryClient.invalidateQueries(QueryCacheKey.FollowsByUserPublicKeys);
  };

  const { data: creatorsData, isLoading: creatorsLoading } = useCreatorsFeed({
    publicKey: publicAddress,
    userIds: creatorIds,
    limit: 80,
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
        enableHeader={true}
        onFollowUpdate={onFollowUpdate}
        noMoreResults={true}
      />
      <HomePageButton href="/creators">View all creators</HomePageButton>
    </Grid>
  );
}

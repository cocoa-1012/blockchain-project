import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { gql } from '@apollo/client';
import { ClientError } from 'graphql-request';

import AggregateCount from 'types/Aggregate';
import { QueryCacheKey } from 'types/Queries';

import { maybeGetAddress } from 'utils/users';
import { fndHasuraClient } from 'lib/clients/graphql';

const GET_HASURA_USER_FOLLOW_COUNTS = gql`
  query getHasuraUserFollowCounts($publicKey: String!) {
    followerCount: follow_aggregate(
      where: { followedUser: { _eq: $publicKey }, isFollowing: { _eq: true } }
    ) {
      aggregate {
        count
      }
    }
    followingCount: follow_aggregate(
      where: { user: { _eq: $publicKey }, isFollowing: { _eq: true } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

async function getFollowCounts(publicKey: string): Promise<FollowStateData> {
  const client = fndHasuraClient();
  return await client.request<FollowStateData>(GET_HASURA_USER_FOLLOW_COUNTS, {
    publicKey: maybeGetAddress(publicKey),
  });
}

interface FollowStateData {
  followingCount: AggregateCount;
  followerCount: AggregateCount;
}

interface FollowStateArgs
  extends UseQueryOptions<FollowStateData, ClientError, FollowStateData> {
  publicKey: string;
}

export default function useFollowCounts({
  publicKey,
  refetchOnWindowFocus = false,
}: FollowStateArgs): UseQueryResult<FollowStateData, ClientError> {
  return useQuery(
    [QueryCacheKey.UserFollowCounts, { publicKey }],
    () => getFollowCounts(publicKey),
    {
      enabled: Boolean(publicKey),
      refetchOnWindowFocus,
    }
  );
}

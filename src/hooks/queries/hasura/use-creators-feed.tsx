import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from 'react-query';
import { gql } from '@apollo/client';
import { ClientError } from 'graphql-request';

import { fndHasuraClient } from 'lib/clients/graphql';
import { HasuraFeedUserFragment } from 'queries/hasura/hasura-fragments';

import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

import { maybeGetAddressOrEmpty } from 'utils/users';
import { getNextPageParam } from 'utils/artwork/artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

const HASURA_CREATORS_BY_IDS_FEED = gql`
  query hasuraUsersFeed(
    $publicKey: String!
    $userIds: [String!]!
    $limit: Int!
    $offset: Int!
  ) {
    users: user(
      limit: $limit
      offset: $offset
      order_by: { createdAt: desc }
      where: {
        publicKey: { _in: $userIds }
        moderationStatus: { _eq: "ACTIVE" }
      }
    ) {
      ...HasuraFeedUserFragment
    }
  }
  ${HasuraFeedUserFragment}
`;

interface GetCreatorsFeedArgs {
  publicKey: string;
  userIds: string[];
  limit: number;
  offset: number;
}

async function getCreatorsFeed({
  publicKey,
  userIds,
  limit,
  offset,
}: GetCreatorsFeedArgs): Promise<AccountFeed[]> {
  const client = fndHasuraClient();
  const { users } = await client.request<{ users: AccountFeed[] }>(
    HASURA_CREATORS_BY_IDS_FEED,
    {
      publicKey,
      userIds,
      limit,
      offset,
    }
  );
  return users;
}

interface CreatorsFeedArgs
  extends UseInfiniteQueryOptions<AccountFeed[], ClientError, AccountFeed[]> {
  publicKey: string;
  userIds: string[];
  limit?: number;
}

export default function useCreatorsFeed({
  publicKey,
  userIds,
  refetchOnWindowFocus = false,
  limit = PUBLIC_FEED_PER_PAGE_COUNT,
}: CreatorsFeedArgs): UseInfiniteQueryResult<AccountFeed[], ClientError> {
  const publicAddress = maybeGetAddressOrEmpty(publicKey);

  return useInfiniteQuery(
    [QueryCacheKey.FeedFeaturedCreators, { publicAddress }],
    ({ pageParam = 0 }) => {
      return getCreatorsFeed({
        publicKey: publicAddress,
        userIds,
        limit,
        offset: limit * pageParam,
      });
    },
    {
      refetchOnWindowFocus,
      getNextPageParam,
    }
  );
}

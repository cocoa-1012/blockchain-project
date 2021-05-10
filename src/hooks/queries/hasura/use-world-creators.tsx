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

import { CATEGORY_PER_PAGE_COUNT } from 'lib/constants';

const HASURA_CREATORS_BY_IDS = gql`
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

interface GetWorldCreatorsArgs {
  publicKey: string;
  userIds: string[];
  limit: number;
  offset: number;
}

async function getWorldCreators({
  publicKey,
  userIds,
  limit,
  offset,
}: GetWorldCreatorsArgs): Promise<AccountFeed[]> {
  const client = fndHasuraClient();
  const { users } = await client.request<{ users: AccountFeed[] }>(
    HASURA_CREATORS_BY_IDS,
    {
      publicKey,
      userIds,
      limit,
      offset,
    }
  );
  return users;
}

interface WorldCreatorsArgs
  extends UseInfiniteQueryOptions<AccountFeed[], ClientError, AccountFeed[]> {
  publicKey: string;
  userIds: string[];
  world: string;
}

export default function useWorldCreators({
  publicKey,
  world,
  userIds,
  refetchOnWindowFocus = false,
}: WorldCreatorsArgs): UseInfiniteQueryResult<AccountFeed[], ClientError> {
  const publicAddress = maybeGetAddressOrEmpty(publicKey);

  return useInfiniteQuery(
    [QueryCacheKey.WorldCreators, { world, publicAddress }],
    ({ pageParam = 0 }) => {
      return getWorldCreators({
        publicKey: publicAddress,
        userIds,
        limit: CATEGORY_PER_PAGE_COUNT,
        offset: CATEGORY_PER_PAGE_COUNT * pageParam,
      });
    },
    {
      refetchOnWindowFocus,
      getNextPageParam,
    }
  );
}

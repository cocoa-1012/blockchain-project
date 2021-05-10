import { UseInfiniteQueryOptions, useInfiniteQuery } from 'react-query';
import { DocumentNode } from 'graphql';
import { ClientError } from 'graphql-request';

import { fndHasuraClient } from 'lib/clients/graphql';

import { UserFollow } from 'types/Follow';
import { QueryCacheKey } from 'types/Queries';

import { getNextPageParam } from 'utils/artwork/artwork';
import { maybeGetAddressOrEmpty } from 'utils/users';

export interface FollowsVariables
  extends UseInfiniteQueryOptions<UserFollow[], ClientError, UserFollow[]> {
  publicKey: string;
  currentUserPublicKey: string;
}

interface FollowsFnVariables extends FollowsVariables {
  limit: number;
  offset: number;
  queryDocument: DocumentNode;
}

interface FollowsFnData {
  follows: UserFollow[];
}

async function getFollowsFn({
  queryDocument,
  publicKey,
  currentUserPublicKey,
  limit,
  offset,
}: FollowsFnVariables): Promise<UserFollow[]> {
  const client = fndHasuraClient();
  const { follows } = await client.request<
    FollowsFnData,
    Omit<FollowsFnVariables, 'queryDocument'>
  >(queryDocument, {
    currentUserPublicKey: maybeGetAddressOrEmpty(currentUserPublicKey),
    publicKey,
    offset,
    limit,
  });
  return follows;
}

interface FollowsArgs extends FollowsVariables {
  cacheKey: QueryCacheKey;
  publicKey: string;
  currentUserPublicKey: string;
  queryDocument: DocumentNode;
  perPage: number;
}

export default function useFollows({
  publicKey,
  currentUserPublicKey,
  perPage,
  cacheKey,
  queryDocument,
  enabled,
  refetchOnWindowFocus = false,
  refetchOnMount = false,
  refetchOnReconnect = false,
}: FollowsArgs): any {
  return useInfiniteQuery(
    [cacheKey, { publicKey }],
    ({ pageParam = 0 }) => {
      return getFollowsFn({
        queryDocument,
        publicKey,
        currentUserPublicKey,
        limit: perPage,
        offset: perPage * pageParam,
      });
    },
    {
      enabled,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      getNextPageParam,
    }
  );
}

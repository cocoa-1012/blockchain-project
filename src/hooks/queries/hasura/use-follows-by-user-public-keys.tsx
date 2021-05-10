import { gql } from '@apollo/client';
import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { ClientError } from 'graphql-request';

import { fndHasuraClient } from 'lib/clients/graphql';

import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

import { mapGetAddress, maybeGetAddress } from 'utils/users';

const GET_HASURA_USER_FOLLOWS = gql`
  query getFollowsByUserPublicKeys(
    $publicKey: String!
    $creatorIds: [String!]!
  ) {
    users: user(where: { publicKey: { _in: $creatorIds } }) {
      publicKey
      follows(
        where: { user: { _eq: $publicKey }, isFollowing: { _eq: true } }
      ) {
        isFollowing
        id
      }
      followerCount: follows_aggregate(where: { isFollowing: { _eq: true } }) {
        aggregate {
          count
        }
      }
    }
  }
`;

interface FollowsByUserPublicKeysArgs {
  publicKey: string;
  creatorIds: string[];
}

async function getFollowsByUserPublicKeys({
  publicKey,
  creatorIds,
}: FollowsByUserPublicKeysArgs): Promise<FollowsData> {
  const client = fndHasuraClient();
  return await client.request<FollowsData>(GET_HASURA_USER_FOLLOWS, {
    publicKey: maybeGetAddress(publicKey),
    creatorIds: mapGetAddress(creatorIds),
  });
}

interface FollowsData {
  users: AccountFeed[];
}

interface FollowsArgs
  extends FollowsByUserPublicKeysArgs,
    UseQueryOptions<FollowsData, ClientError, FollowsData> {}

export default function useFollowsByUserPublicKeys({
  publicKey,
  creatorIds,
  refetchOnWindowFocus = false,
}: FollowsArgs): UseQueryResult<FollowsData, ClientError> {
  return useQuery(
    [QueryCacheKey.FollowsByUserPublicKeys, creatorIds],
    () => getFollowsByUserPublicKeys({ publicKey, creatorIds }),
    { enabled: Boolean(publicKey), refetchOnWindowFocus }
  );
}

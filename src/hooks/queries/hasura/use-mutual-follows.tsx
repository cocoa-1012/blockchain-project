import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { gql } from '@apollo/client';
import { ClientError } from 'graphql-request';

import { fndHasuraClient } from 'lib/clients/graphql';

import { UserFollow } from 'types/Follow';
import { QueryCacheKey } from 'types/Queries';
import { HasuraUserFragmentLight } from 'queries/hasura/hasura-fragments';

const USER_MUTUAL_FOLLOWS = gql`
  query userMutualFollows(
    $publicKey: String!
    $currentUserPublicKey: String!
    $limit: Int!
  ) {
    mutualFollows: follow(
      limit: $limit
      where: {
        isFollowing: { _eq: true }
        _and: [
          { followedUser: { _eq: $publicKey } }
          {
            userByFollowingUser: {
              follows: {
                user: { _eq: $currentUserPublicKey }
                isFollowing: { _eq: true }
              }
            }
          }
        ]
      }
    ) {
      id
      user: userByFollowingUser {
        ...HasuraUserFragmentLight
      }
    }
  }
  ${HasuraUserFragmentLight}
`;

async function getMutualFollows({
  publicKey,
  currentUserPublicKey,
  limit,
}: MutualFollowsVariables) {
  const client = fndHasuraClient();
  return await client.request<MutualFollows, MutualFollowsVariables>(
    USER_MUTUAL_FOLLOWS,
    { publicKey, currentUserPublicKey, limit }
  );
}

interface MutualFollows {
  mutualFollows: UserFollow[];
}

interface MutualFollowsVariables {
  publicKey: string;
  currentUserPublicKey: string;
  limit: number;
}

interface MutualFollowsHookVariables
  extends MutualFollowsVariables,
    UseQueryOptions<MutualFollows, ClientError, MutualFollows> {}

export default function useMutualFollows({
  publicKey,
  currentUserPublicKey,
  limit,
  enabled = true,
  refetchOnWindowFocus = false,
  refetchOnMount = true,
}: MutualFollowsHookVariables): UseQueryResult<MutualFollows, ClientError> {
  return useQuery(
    [QueryCacheKey.MutualFollows, { publicKey, currentUserPublicKey }],
    () => getMutualFollows({ publicKey, currentUserPublicKey, limit }),
    {
      enabled: Boolean(publicKey && currentUserPublicKey && enabled),
      refetchOnWindowFocus,
      refetchOnMount,
    }
  );
}

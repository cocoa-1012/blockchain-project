import { gql } from '@apollo/client';
import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { ClientError } from 'graphql-request';

import { QueryCacheKey } from 'types/Queries';
import { FollowStateData } from './types';

import { maybeGetAddress, maybeGetAddressOrEmpty } from 'utils/users';
import { isAllTrue } from 'utils/helpers';

import { HasuraFollowFragment } from 'queries/hasura/hasura-fragments';

import { fndHasuraClient } from 'lib/clients/graphql';

export const GET_HASURA_USER_FOLLOW_STATE = gql`
  query getHasuraUserFollowState(
    $currentUserPublicKey: String!
    $publicKey: String!
  ) {
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
    mutualFollowCount: follow_aggregate(
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
      aggregate {
        count
      }
    }
    follows: follow(
      where: {
        user: { _eq: $currentUserPublicKey }
        followedUser: { _eq: $publicKey }
        isFollowing: { _eq: true }
      }
    ) {
      ...HasuraFollowFragment
    }
  }
  ${HasuraFollowFragment}
`;

async function getFollowState({
  publicKey,
  currentUserPublicKey,
}: FollowStateArgs): Promise<FollowStateData> {
  const client = fndHasuraClient();
  return await client.request<FollowStateData, FollowStateArgs>(
    GET_HASURA_USER_FOLLOW_STATE,
    {
      publicKey: maybeGetAddress(publicKey),
      currentUserPublicKey: maybeGetAddressOrEmpty(currentUserPublicKey),
    }
  );
}

interface FollowStateArgs {
  currentUserPublicKey: string;
  publicKey: string;
}

interface FollowStateVariables
  extends FollowStateArgs,
    UseQueryOptions<FollowStateData, ClientError, FollowStateData> {}

export default function useFollowState({
  publicKey,
  currentUserPublicKey,
  enabled = true,
  refetchOnWindowFocus = false,
  refetchOnMount = true,
}: FollowStateVariables): UseQueryResult<FollowStateData, ClientError> {
  return useQuery(
    [QueryCacheKey.FollowState, { publicKey, currentUserPublicKey }],
    () => getFollowState({ publicKey, currentUserPublicKey }),
    {
      enabled: isAllTrue([publicKey, enabled]),
      refetchOnWindowFocus,
      refetchOnMount,
    }
  );
}

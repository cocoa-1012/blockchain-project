import { gql } from '@apollo/client';
import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

import { QueryCacheKey } from 'types/Queries';
import { FollowsHookData, FollowsVariables } from '../subgraph/types';

import useFollows from './use-follows';

const USER_FOLLOWERS_QUERY = gql`
  query userFollowersQuery(
    $publicKey: String!
    $currentUserPublicKey: String!
    $offset: Int!
    $limit: Int!
  ) {
    follows: follow(
      where: { followedUser: { _eq: $publicKey }, isFollowing: { _eq: true } }
      offset: $offset
      limit: $limit
    ) {
      id
      user: userByFollowingUser {
        name
        username
        profileImageUrl
        userIndex
        publicKey
        follows(
          where: {
            user: { _eq: $currentUserPublicKey }
            isFollowing: { _eq: true }
          }
        ) {
          createdAt
          isFollowing
        }
      }
    }
  }
`;

export default function useFollowers({
  publicKey,
  currentUserPublicKey,
  perPage = PUBLIC_FEED_PER_PAGE_COUNT,
  enabled = true,
  refetchOnWindowFocus = false,
  refetchOnMount = true,
  cacheKey = QueryCacheKey.UserFollowers,
}: FollowsVariables): FollowsHookData {
  return useFollows({
    cacheKey: cacheKey,
    queryDocument: USER_FOLLOWERS_QUERY,
    publicKey,
    currentUserPublicKey,
    perPage,
    refetchOnWindowFocus,
    refetchOnMount,
    enabled: Boolean(publicKey) && enabled,
  });
}

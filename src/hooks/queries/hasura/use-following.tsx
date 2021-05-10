import { gql } from '@apollo/client';
import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

import { QueryCacheKey } from 'types/Queries';
import { FollowsHookData, FollowsVariables } from '../subgraph/types';

import useFollows from './use-follows';

const USER_FOLLOWING_QUERY = gql`
  query userFollowingQuery(
    $publicKey: String!
    $currentUserPublicKey: String!
    $offset: Int!
    $limit: Int!
  ) {
    follows: follow(
      where: { user: { _eq: $publicKey }, isFollowing: { _eq: true } }
      offset: $offset
      limit: $limit
    ) {
      id
      user: userByFollowedUser {
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

export default function useFollowing({
  publicKey,
  currentUserPublicKey,
  perPage = PUBLIC_FEED_PER_PAGE_COUNT,
  enabled = true,
  refetchOnWindowFocus = false,
}: FollowsVariables): FollowsHookData {
  return useFollows({
    cacheKey: QueryCacheKey.UserFollowing,
    queryDocument: USER_FOLLOWING_QUERY,
    publicKey,
    currentUserPublicKey,
    perPage,
    refetchOnWindowFocus,
    enabled: Boolean(publicKey) && enabled,
  });
}

import { gql } from '@apollo/client';
import { FollowFragment } from '../server-fragments';

export const CREATE_FOLLOW = gql`
  mutation createFollow($publicKey: String!) {
    follow: createFollow(followingPublicKey: $publicKey) {
      ...FollowFragment
    }
  }
  ${FollowFragment}
`;

export const REMOVE_FOLLOW = gql`
  mutation removeFollow($publicKey: String!) {
    follow: removeFollow(followingPublicKey: $publicKey) {
      ...FollowFragment
    }
  }
  ${FollowFragment}
`;

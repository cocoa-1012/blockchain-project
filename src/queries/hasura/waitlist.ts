/* eslint-disable max-lines */

import { gql } from '@apollo/client';

import { fndHasuraClient, fndServerClient } from 'lib/clients/graphql';

import {
  HasuraSocialVerificationFragment,
  HasuraUserFragment,
} from './hasura-fragments';

import AggregateCount from 'types/Aggregate';
import WaitlistVote from 'types/WaitlistVote';
import { WaitlistRankedUser, WaitlistUser } from 'types/Waitlist';

export interface HasuraWaitlistUsersArgs {
  limit: number;
  maxRank: number;
}

export interface HasuraWaitlistUserResponse {
  users: WaitlistUser[];
}

export interface HasuraWaitlistUsersSearchArgs {
  limit: number;
  searchQuery: string;
}

const HasuraWaitlistUserFragment = gql`
  fragment HasuraWaitlistUserFragment on user {
    ...HasuraUserFragment
    twitSocialVerifs: socialVerifications(
      where: { isValid: { _eq: true }, service: { _eq: "TWITTER" } }
      limit: 1
    ) {
      ...HasuraSocialVerificationFragment
    }
    instaSocialVerifs: socialVerifications(
      where: { isValid: { _eq: true }, service: { _eq: "INSTAGRAM" } }
      limit: 1
    ) {
      ...HasuraSocialVerificationFragment
    }
    waitlistInfo {
      rankNumber
    }
  }
  ${HasuraUserFragment}
  ${HasuraSocialVerificationFragment}
`;

export const HASURA_WAITLIST_USERS_QUERY = gql`
  query waitlistUsersQuery($maxRank: bigint, $limit: Int) {
    rankedWaitlist: ranked_waitlist(
      limit: $limit
      where: { rankNumber: { _lte: $maxRank } }
    ) {
      rankNumber
      user {
        ...HasuraUserFragment
        twitSocialVerifs: socialVerifications(
          where: { isValid: { _eq: true }, service: { _eq: "TWITTER" } }
          limit: 1
        ) {
          ...HasuraSocialVerificationFragment
        }
        instaSocialVerifs: socialVerifications(
          where: { isValid: { _eq: true }, service: { _eq: "INSTAGRAM" } }
          limit: 1
        ) {
          ...HasuraSocialVerificationFragment
        }
      }
    }
  }
  ${HasuraUserFragment}
  ${HasuraSocialVerificationFragment}
`;

export async function getHasuraWaitlistUsers({
  limit,
  maxRank,
}: HasuraWaitlistUsersArgs): Promise<WaitlistRankedUser[]> {
  const client = fndHasuraClient();
  const { rankedWaitlist } = await client.request<{
    rankedWaitlist: WaitlistRankedUser[];
  }>(HASURA_WAITLIST_USERS_QUERY, { limit, maxRank });
  return rankedWaitlist;
}

export const HASURA_WAITLIST_USERS_SEARCH_QUERY = gql`
  query waitlistSearchQuery($searchQuery: String!, $limit: Int!) {
    users: user(
      where: {
        # only search non-creators
        isApprovedCreator: { _eq: false }
        # exclude hidden creators
        hiddenAt: { _is_null: true }
        moderationStatus: { _eq: "ACTIVE" }
        # must have joined the waitlist
        joinedWaitlistAt: { _is_null: false }
        # search across both name and username
        _or: [
          { name: { _ilike: $searchQuery } }
          { username: { _ilike: $searchQuery } }
        ]
        # must have social verification
        socialVerifications: { isValid: { _eq: true } }
      }
      # sort by vote rank
      order_by: { waitlistInfo: { rankNumber: asc } }
      # pagination controls
      limit: $limit
    ) {
      ...HasuraWaitlistUserFragment
    }
  }

  ${HasuraWaitlistUserFragment}
`;

export async function getHasuraWaitlistUsersSearch({
  limit,
  searchQuery,
}: HasuraWaitlistUsersSearchArgs): Promise<WaitlistUser[]> {
  const client = fndHasuraClient();

  const { users } = await client.request<HasuraWaitlistUserResponse>(
    HASURA_WAITLIST_USERS_SEARCH_QUERY,
    {
      limit,
      searchQuery: `%${searchQuery}%`,
    }
  );

  return users;
}

export interface WaitlistJoinResponse {
  joinWaitlist: boolean;
}

export const WAITLIST_JOIN_MUTATION = gql`
  mutation joinWaitlist {
    joinWaitlist
  }
`;

export async function setWaitlistJoin(
  token: string
): Promise<WaitlistJoinResponse> {
  const client = fndServerClient(token);

  return await client.request<WaitlistJoinResponse>(WAITLIST_JOIN_MUTATION);
}

export interface WaitlistLeaveResponse {
  joinWaitlist: boolean;
}

export const WAITLIST_LEAVE_MUTATION = gql`
  mutation leaveWaitlist {
    leaveWaitlist
  }
`;

export async function setWaitlistLeave(
  token: string
): Promise<WaitlistLeaveResponse> {
  const client = fndServerClient(token);

  return await client.request<WaitlistLeaveResponse>(WAITLIST_LEAVE_MUTATION);
}

export interface WaitlistAddVoteResponse {
  id: string;
}

export const WAITLIST_ADD_VOTE_MUTATION = gql`
  mutation voteFor($publicKey: String!) {
    voteFor(voteForPublicKey: $publicKey) {
      id
    }
  }
`;

export async function setWaitlistAddVote({
  token,
  publicKey,
}: {
  token: string;
  publicKey: string;
}): Promise<WaitlistAddVoteResponse> {
  const client = fndServerClient(token);

  return await client.request<WaitlistAddVoteResponse>(
    WAITLIST_ADD_VOTE_MUTATION,
    { publicKey }
  );
}

export interface WaitlistRemoveVoteResponse {
  id: string;
}

export const WAITLIST_REMOVE_VOTE_MUTATION = gql`
  mutation removeVoteFor($publicKey: String!) {
    removeVoteFor(voteForPublicKey: $publicKey) {
      id
    }
  }
`;

export async function setWaitlistRemoveVote({
  token,
  publicKey,
}: {
  token: string;
  publicKey: string;
}): Promise<WaitlistRemoveVoteResponse> {
  const client = fndServerClient(token);

  return await client.request<WaitlistRemoveVoteResponse>(
    WAITLIST_REMOVE_VOTE_MUTATION,
    { publicKey }
  );
}

export interface WaitlistTotalCountResponse {
  user_aggregate: AggregateCount;
}

export const WAITLIST_TOTAL_USER_COUNT = gql`
  query waitlistCountQuery {
    user_aggregate(
      where: {
        # only search non-creators
        isApprovedCreator: { _eq: false }
        # exclude hidden creators
        hiddenAt: { _is_null: true }
        moderationStatus: { _eq: "ACTIVE" }
        joinedWaitlistAt: { _is_null: false }
        socialVerifications: { isValid: { _eq: true } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export async function getWaitlistTotalCount(): Promise<WaitlistTotalCountResponse> {
  const client = fndHasuraClient();

  return await client.request<WaitlistTotalCountResponse>(
    WAITLIST_TOTAL_USER_COUNT
  );
}

export interface WaitlistUsedVotesResponse {
  user: WaitlistUser;
}

export const WAITLIST_USED_VOTES = gql`
  query remainingVotesQuery($publicKey: String!) {
    waitlistVotes: waitlist_vote(
      where: {
        voteByUserPublicKey: { _eq: $publicKey }
        deletedAt: { _is_null: true }
        userVoteFor: { isApprovedCreator: { _eq: false } }
      }
    ) {
      id
      deletedAt
      voteForUserPublicKey
      userVoteFor {
        ...HasuraWaitlistUserFragment
      }
    }
  }
  ${HasuraWaitlistUserFragment}
`;

interface WaitlistVotes {
  waitlistVotes: WaitlistVote[];
}

export async function getWaitlistUsedVotes(
  publicKey: string
): Promise<WaitlistVotes> {
  const client = fndHasuraClient();
  return await client.request<WaitlistVotes>(WAITLIST_USED_VOTES, {
    publicKey,
  });
}

export const HASURA_WAITLIST_USER_QUERY = gql`
  query rankedWaitlistUserQuery($publicKey: String!) {
    rankedWaitlistUser: ranked_waitlist(
      where: { publicKey: { _eq: $publicKey } }
      order_by: { rankNumber: asc }
    ) {
      rankNumber
      user {
        ...HasuraUserFragment
        twitSocialVerifs: socialVerifications(
          where: { isValid: { _eq: true }, service: { _eq: "TWITTER" } }
          limit: 1
        ) {
          ...HasuraSocialVerificationFragment
        }
        instaSocialVerifs: socialVerifications(
          where: { isValid: { _eq: true }, service: { _eq: "INSTAGRAM" } }
          limit: 1
        ) {
          ...HasuraSocialVerificationFragment
        }
      }
    }
  }
  ${HasuraUserFragment}
  ${HasuraSocialVerificationFragment}
`;

export async function getWaitlistUser(
  publicKey: string
): Promise<{ rankedWaitlistUser: WaitlistRankedUser }> {
  const client = fndHasuraClient();
  return await client.request<{ rankedWaitlistUser: WaitlistRankedUser }>(
    HASURA_WAITLIST_USER_QUERY,
    {
      publicKey,
    }
  );
}

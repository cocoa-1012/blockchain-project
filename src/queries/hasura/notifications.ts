import { gql } from 'graphql-request';
import { fndHasuraClient, fndServerClient } from 'lib/clients/graphql';

import {
  LastReadNotificationTimestampResponse,
  NotificationsCountResponse,
  NotificationsFollowsResponse,
} from 'types/Notification';

// Get last read notifications timestamp
interface LastReadNotificationTimestampArgs {
  publicKey: string;
}

const LAST_READ_NOTIFICATIONS_QUERY = gql`
  query getLastReadNotificationTimestamp($publicKey: String!) {
    user: user_by_pk(publicKey: $publicKey) {
      lastReadNotificationsAt
    }
  }
`;

export async function getLastReadNotificationTimestamp({
  publicKey,
}: LastReadNotificationTimestampArgs): Promise<LastReadNotificationTimestampResponse> {
  const client = fndHasuraClient();

  return await client.request<LastReadNotificationTimestampResponse>(
    LAST_READ_NOTIFICATIONS_QUERY,
    {
      publicKey,
    }
  );
}

// Get Unread Notifications Count
interface NotificationsCountArgs {
  publicKey: string;
  lastReadTimestamp: string;
}

const NOTIFICATIONS_COUNT_QUERY = gql`
  query getNotificationsCount(
    $publicKey: String!
    $lastReadTimestamp: timestamp
  ) {
    notificationsCount: follow_aggregate(
      where: {
        followedUser: { _eq: $publicKey }
        updatedAt: { _gte: $lastReadTimestamp }
        isFollowing: { _eq: true }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export async function getNotificationsCount({
  publicKey,
  lastReadTimestamp,
}: NotificationsCountArgs): Promise<NotificationsCountResponse> {
  const client = fndHasuraClient();

  return await client.request<NotificationsCountResponse>(
    NOTIFICATIONS_COUNT_QUERY,
    {
      publicKey,
      lastReadTimestamp,
    }
  );
}

// Get latest follows
interface NotificationsFollowsArgs {
  publicKey: string;
  limit: number;
  offset: number;
}

const NOTIFICATIONS_FOLLOWS_QUERY = gql`
  query getNotificationsFollows(
    $publicKey: String!
    $offset: Int!
    $limit: Int!
  ) {
    follow(
      where: { followedUser: { _eq: $publicKey }, isFollowing: { _eq: true } }
      order_by: { updatedAt: desc }
      limit: $limit
      offset: $offset
    ) {
      user: userByFollowingUser {
        name
        username
        profileImageUrl
        userIndex
        publicKey
        follows(
          where: { user: { _eq: $publicKey }, isFollowing: { _eq: true } }
        ) {
          isFollowing
        }
      }
      updatedAt
    }
  }
`;

export async function getNotificationsFollows({
  publicKey,
  limit,
  offset,
}: NotificationsFollowsArgs): Promise<NotificationsFollowsResponse> {
  const client = fndHasuraClient();

  return await client.request<NotificationsFollowsResponse>(
    NOTIFICATIONS_FOLLOWS_QUERY,
    {
      publicKey,
      limit,
      offset,
    }
  );
}

// Set the last read notification timestamp
export interface LastReadNotificationTimestampMutationResponse {
  updateUserLastReadNotificationAt: boolean;
}

export const LAST_READ_NOTIFICATION_TIMESTAMP_MUTATION = gql`
  mutation updateLastRead {
    updateUserLastReadNotificationAt
  }
`;

export async function setLastReadNotificationTimestamp(
  token: string
): Promise<LastReadNotificationTimestampMutationResponse> {
  const client = fndServerClient(token);

  return await client.request<LastReadNotificationTimestampMutationResponse>(
    LAST_READ_NOTIFICATION_TIMESTAMP_MUTATION
  );
}

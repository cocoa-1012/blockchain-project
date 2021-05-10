/* eslint-disable max-lines */
import { DocumentNode, gql } from '@apollo/client';
import { getAddress } from '@ethersproject/address';

import { getFirstValue, isETHAddress, mapStrToCheckSum } from 'utils/helpers';

import { fndHasuraClient, hasuraFetcher } from 'lib/clients/graphql';
import {
  HasuraFeedUserFragment,
  HasuraUserFragment,
  HasuraUserProfileFragment,
} from './hasura-fragments';

import Account, {
  AccountExtended,
  AccountFeed,
  Collector,
} from 'types/Account';
import ModerationStatus from 'types/ModerationStatus';
import { HasuraUsersQueryArgs } from './types';
import { getProfileCollectors } from './collectors';

import {
  UserArtworksCounts,
  UserArtworksCountsDocument,
  UserArtworksCountsVariables,
} from 'graphql/hasura/queries/user-artworks-counts.generated';
import { maybeGetAddress } from 'utils/users';

import { getENSNameByPublicKey } from 'hooks/queries/ens/use-ens-names';

import {
  UserPublicKeyByUsername,
  UserPublicKeyByUsernameDocument,
  UserPublicKeyByUsernameVariables,
} from 'graphql/hasura/queries/user-public-key-by-username.generated';
import { head } from 'ramda';
import {
  UserArtworksCreatedCount,
  UserArtworksCreatedCountDocument,
  UserArtworksCreatedCountVariables,
} from 'graphql/hasura/queries/user-artworks-created-count.generated';

interface UserData {
  user: Account;
}

interface FeedUserData {
  users: AccountFeed[];
}

interface UsersData {
  users: Account[];
}

interface ExtendedUserData {
  user: AccountExtended;
}

interface ExtendedUsersData {
  users: AccountExtended[];
}

// helper functions to build queries
export async function buildHasuraUserQuery<T>(
  publicKey: string,
  query: DocumentNode
): Promise<T> {
  const client = fndHasuraClient();
  return await client.request<T>(query, {
    publicKey: getAddress(publicKey),
  });
}

export async function buildHasuraUsernameQuery<T>(
  username: string,
  query: DocumentNode
): Promise<T> {
  const client = fndHasuraClient();
  return await client.request<T>(query, { username });
}

export const HASURA_USER_BY_PUBLIC_KEY_QUERY = gql`
  query hasuraUserByPublicKey($publicKey: String!) {
    user: user_by_pk(publicKey: $publicKey) {
      ...HasuraUserFragment
    }
  }
  ${HasuraUserFragment}
`;

export async function getHasuraUserByPublicKey(
  publicKey: string
): Promise<UserData> {
  return await buildHasuraUserQuery<UserData>(
    publicKey,
    HASURA_USER_BY_PUBLIC_KEY_QUERY
  );
}

export const HASURA_USERNAME_BY_PUBLIC_KEY_QUERY = gql`
  query hasuraUsernameByPublicKey($publicKey: String!) {
    user: user_by_pk(publicKey: $publicKey) {
      publicKey
      username
      profileImageUrl
      userIndex
      isAdmin
    }
  }
`;

export async function getHasuraUsernameByPublicKey(
  publicKey: string
): Promise<UserData> {
  return await buildHasuraUserQuery<UserData>(
    publicKey,
    HASURA_USERNAME_BY_PUBLIC_KEY_QUERY
  );
}

export const HASURA_USER_PROFILE_BY_PUBLIC_KEY_QUERY = gql`
  query hasuraUserProfileByPublicKey($publicKey: String!) {
    user: user_by_pk(publicKey: $publicKey) {
      ...HasuraUserProfileFragment
    }
  }
  ${HasuraUserProfileFragment}
`;

export async function getHasuraUserProfileByPublicKey(
  publicKey: string
): Promise<ExtendedUserData> {
  return await buildHasuraUserQuery<ExtendedUserData>(
    publicKey,
    HASURA_USER_PROFILE_BY_PUBLIC_KEY_QUERY
  );
}

export const HASURA_USER_PROFILE_BY_USERNAME_QUERY = gql`
  query hasuraUserProfileByUsername($username: citext!) {
    users: user(where: { username: { _eq: $username } }) {
      ...HasuraUserProfileFragment
    }
  }
  ${HasuraUserProfileFragment}
`;

export async function getHasuraUserProfileByUsername(
  username: string
): Promise<ExtendedUserData> {
  const { users } = await buildHasuraUsernameQuery<ExtendedUsersData>(
    username,
    HASURA_USER_PROFILE_BY_USERNAME_QUERY
  );
  return { user: getFirstValue(users) };
}

export const HASURA_USER_BY_USERNAME_QUERY = gql`
  query hasuraUserByUsername($username: citext!) {
    users: user(where: { username: { _eq: $username } }) {
      ...HasuraUserFragment
    }
  }
  ${HasuraUserFragment}
`;

export async function getHasuraUserByUsername(
  username: string
): Promise<UserData> {
  const { users } = await buildHasuraUsernameQuery<UsersData>(
    username,
    HASURA_USER_BY_USERNAME_QUERY
  );
  return { user: getFirstValue(users) };
}

export const HASURA_USER_BY_USERNAMES_QUERY = gql`
  query hasuraUsersByUsernames($usernames: [citext!]!) {
    users: user(where: { username: { _in: $usernames } }) {
      ...HasuraUserFragment
    }
  }
  ${HasuraUserFragment}
`;

export async function getHasuraUsersByUsernames(
  usernames: string[]
): Promise<UsersData> {
  const client = fndHasuraClient();
  return await client.request<UsersData>(HASURA_USER_BY_USERNAMES_QUERY, {
    usernames,
  });
}

export const HASURA_USERS_QUERY = gql`
  query hasuraUsersByIds(
    $publicKeys: [String!]!
    $moderationStatuses: [user_moderationstatus_enum!]
  ) {
    users: user(
      where: {
        publicKey: { _in: $publicKeys }
        moderationStatus: { _in: $moderationStatuses }
      }
    ) {
      ...HasuraUserFragment
    }
  }
  ${HasuraUserFragment}
`;

export async function getHasuraUsers({
  publicKeys,
  moderationStatuses = [ModerationStatus.Active],
}: HasuraUsersQueryArgs): Promise<UsersData> {
  const client = fndHasuraClient();
  return await client.request<UsersData>(HASURA_USERS_QUERY, {
    publicKeys: mapStrToCheckSum(publicKeys),
    moderationStatuses,
  });
}

export const HASURA_FEED_USERS_QUERY = gql`
  query hasuraFeedUsersByIds($userIds: [String!]!, $publicKey: String!) {
    users: user(
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

interface HasuraFeedUsersArgs {
  userIds: string[];
  moderationStatuses?: ModerationStatus[];
  publicKey: string;
}

export async function getHasuraFeedUsers({
  userIds,
  publicKey,
}: HasuraFeedUsersArgs): Promise<FeedUserData> {
  const client = fndHasuraClient();
  return await client.request<FeedUserData>(HASURA_FEED_USERS_QUERY, {
    userIds: mapStrToCheckSum(userIds),
    publicKey,
  });
}

export const HASURA_USERS_SEARCH_QUERY = gql`
  query userSearchQuery(
    $searchQuery: String!
    $offset: Int!
    $limit: Int!
    $moderationStatuses: [user_moderationstatus_enum!]
    $publicKey: String!
  ) {
    users: user(
      where: {
        # only search creators
        isApprovedCreator: { _eq: true }
        # exclude hidden creators
        hiddenAt: { _is_null: true }
        moderationStatus: { _in: $moderationStatuses }
        # search across both name and username
        _or: [
          { name: { _ilike: $searchQuery } }
          { username: { _ilike: $searchQuery } }
        ]
        artworks: { tokenId: { _is_null: false } }
      }
      # favour profiles that were created earlier and
      # that have important info filled out
      order_by: {
        userIndex: asc
        name: desc_nulls_last
        profileImageUrl: desc_nulls_last
        coverImageUrl: desc_nulls_last
      }
      offset: $offset
      limit: $limit
    ) {
      ...HasuraFeedUserFragment
    }
  }
  ${HasuraFeedUserFragment}
`;

// use find vs. get as it’s a search-like feature
export async function findHasuraUsers(
  searchQuery: string
): Promise<FeedUserData> {
  const client = fndHasuraClient();
  return await client.request<FeedUserData>(HASURA_USERS_SEARCH_QUERY, {
    // find all occurences containing the substring
    searchQuery: `%${searchQuery}%`,
    // limit statuses only to active
    moderationStatuses: [ModerationStatus.Active],
  });
}

async function getUserPublicKeyByUsername(
  variables: UserPublicKeyByUsernameVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    UserPublicKeyByUsername,
    UserPublicKeyByUsernameVariables
  >(UserPublicKeyByUsernameDocument, variables);
  return head(query.users);
}

async function getUserByUsernameOrPublicKey(
  usernameOrPublicKey: string
): Promise<AccountExtended> {
  const isAddress = isETHAddress(usernameOrPublicKey);
  if (isAddress) {
    const userQuery = await getHasuraUserProfileByPublicKey(
      usernameOrPublicKey
    );
    return userQuery.user;
  } else {
    const userQuery = await getHasuraUserProfileByUsername(usernameOrPublicKey);
    return userQuery.user;
  }
}

export async function getUserArtworksCounts(
  publicKey: string
): Promise<UserArtworksCounts> {
  const client = fndHasuraClient();
  try {
    return await client.request<
      UserArtworksCounts,
      UserArtworksCountsVariables
    >(UserArtworksCountsDocument, {
      publicKey: maybeGetAddress(publicKey),
      indexedStates: [true],
    });
  } catch (err) {
    return null;
  }
}

export interface UserForProfile {
  user: AccountExtended;
  username: string;
  profileExists: boolean;
  collectors: Collector[];
  ensRegistration: string;
  createdCount: number;
}

export async function getUserForProfile(
  usernameOrPublicKey: string
): Promise<UserForProfile> {
  const isAddress = isETHAddress(usernameOrPublicKey);

  if (isAddress) {
    const [user, collectors, createdCount, ensRegistration] = await Promise.all(
      [
        getUserByUsernameOrPublicKey(usernameOrPublicKey),
        getCollectors(usernameOrPublicKey),
        getUserArtworksCreatedCount({ publicKey: usernameOrPublicKey }),
        getENSNameByPublicKey(usernameOrPublicKey),
      ]
    );

    if (user) {
      return {
        username: usernameOrPublicKey,
        user,
        profileExists: true,
        collectors,
        ensRegistration,
        createdCount,
      };
    } else {
      return {
        username: usernameOrPublicKey,
        user: { publicKey: usernameOrPublicKey },
        profileExists: false,
        collectors: [],
        ensRegistration,
        createdCount: 0,
      };
    }
  } else {
    const userPublicKey = await getUserPublicKeyByUsername({
      username: usernameOrPublicKey,
    });

    const publicKey = userPublicKey.publicKey;

    const [user, collectors, createdCount, ensRegistration] = await Promise.all(
      [
        getUserByUsernameOrPublicKey(publicKey),
        getCollectors(publicKey),
        getUserArtworksCreatedCount({ publicKey }),
        getENSNameByPublicKey(publicKey),
      ]
    );

    console.log({ ensRegistration });

    return {
      username: user.username,
      user,
      profileExists: true,
      collectors,
      ensRegistration,
      createdCount,
    };
  }
}

async function getCollectors(publicKey: string): Promise<Collector[]> {
  try {
    return await getProfileCollectors({
      publicKey: publicKey,
      currentUserPublicKey: '',
      limit: 20,
      offset: 0,
    });
  } catch (err) {
    console.log({ err });
    return [];
  }
}

async function getUserArtworksCreatedCount(
  variables: UserArtworksCreatedCountVariables
) {
  try {
    const query = await hasuraFetcher<
      UserArtworksCreatedCount,
      UserArtworksCreatedCountVariables
    >(UserArtworksCreatedCountDocument, variables)();
    return query.artworksCreatedCount.aggregate.count;
  } catch (err) {
    return 0;
  }
}

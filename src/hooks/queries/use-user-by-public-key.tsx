import { UseQueryResult, useQuery, UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  getUserEmailByPublicKey,
  getUserWithEmailByPublicKey,
} from 'queries/users';
import {
  getHasuraUserByPublicKey,
  getHasuraUsernameByPublicKey,
} from 'queries/hasura/users';

import { UserProviderType } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

interface UserQueryResponse {
  user: UserFragment;
}

interface ServerUserQueryResponse {
  user: UserFragment & { email: string; providerType: UserProviderType };
}

interface UserByPublicKeyArgs
  extends UseQueryOptions<UserQueryResponse, ClientError, UserQueryResponse> {
  publicKey: string;
}

export default function useUserByPublicKey({
  publicKey,
  enabled = true,
  ...options
}: UserByPublicKeyArgs): UseQueryResult<UserQueryResponse, ClientError> {
  return useQuery(
    [QueryCacheKey.User, publicKey],
    () => getHasuraUserByPublicKey(publicKey),
    { enabled: Boolean(publicKey && enabled), ...options }
  );
}

export function useUsernameByPublicKey({
  publicKey,
  enabled = true,
  ...options
}: UserByPublicKeyArgs): UseQueryResult<UserQueryResponse, ClientError> {
  return useQuery(
    ['getHasuraUsernameByPublicKey', publicKey],
    () => getHasuraUsernameByPublicKey(publicKey),
    { enabled: Boolean(publicKey && enabled), ...options }
  );
}

export function useUserEmailByPublicKey(
  publicKey: string,
  token: string
): UseQueryResult<ServerUserQueryResponse, ClientError> {
  return useQuery(
    ['getUserEmailByPublicKey', { publicKey }],
    () => getUserEmailByPublicKey(publicKey, token),
    { enabled: Boolean(publicKey) }
  );
}

export function useUserWithEmailByPublicKey(
  publicKey: string,
  token: string
): UseQueryResult<ServerUserQueryResponse, ClientError> {
  return useQuery(
    ['getUserWithEmailByPublicKey', { publicKey }],
    () => getUserWithEmailByPublicKey(publicKey, token),
    { enabled: Boolean(publicKey) }
  );
}

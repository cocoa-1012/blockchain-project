import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserPublicKeyByUsernameVariables = Types.Exact<{
  username: Types.Scalars['citext'];
}>;


export type UserPublicKeyByUsername = { users: Array<Pick<Types.User, 'publicKey'>> };


export const UserPublicKeyByUsernameDocument = /*#__PURE__*/ `
    query UserPublicKeyByUsername($username: citext!) {
  users: user(where: {username: {_eq: $username}}) {
    publicKey
  }
}
    `;
export const useUserPublicKeyByUsername = <
      TData = UserPublicKeyByUsername,
      TError = Error
    >(
      variables: UserPublicKeyByUsernameVariables, 
      options?: UseQueryOptions<UserPublicKeyByUsername, TError, TData>
    ) => 
    useQuery<UserPublicKeyByUsername, TError, TData>(
      ['UserPublicKeyByUsername', variables],
      hasuraFetcher<UserPublicKeyByUsername, UserPublicKeyByUsernameVariables>(UserPublicKeyByUsernameDocument, variables),
      options
    );
useUserPublicKeyByUsername.getKey = (variables: UserPublicKeyByUsernameVariables) => ['UserPublicKeyByUsername', variables];

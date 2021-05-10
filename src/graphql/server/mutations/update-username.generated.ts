import * as Types from '../types-server.generated';

import { UserFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateUsernameVariables = Types.Exact<{
  username?: Types.Maybe<Types.Scalars['String']>;
  userPublicKey: Types.Scalars['String'];
}>;


export type UpdateUsername = { updateUsername: UserFragment };


export const UpdateUsernameDocument = /*#__PURE__*/ `
    mutation UpdateUsername($username: String, $userPublicKey: String!) {
  updateUsername(username: $username, userPublicKey: $userPublicKey) {
    ...UserFragment
  }
}
    ${UserFragment}`;
export const useUpdateUsername = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUsername, TError, UpdateUsernameVariables, TContext>) => 
    useMutation<UpdateUsername, TError, UpdateUsernameVariables, TContext>(
      useServerFetcher<UpdateUsername, UpdateUsernameVariables>(UpdateUsernameDocument),
      options
    );
import * as Types from '../types-server.generated';

import { UserFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type RemoveUnusedInviteCodesVariables = Types.Exact<{
  userPublicKey: Types.Scalars['String'];
}>;


export type RemoveUnusedInviteCodes = { removeUnusedInviteCodes: UserFragment };


export const RemoveUnusedInviteCodesDocument = /*#__PURE__*/ `
    mutation RemoveUnusedInviteCodes($userPublicKey: String!) {
  removeUnusedInviteCodes(userPublicKey: $userPublicKey) {
    ...UserFragment
  }
}
    ${UserFragment}`;
export const useRemoveUnusedInviteCodes = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveUnusedInviteCodes, TError, RemoveUnusedInviteCodesVariables, TContext>) => 
    useMutation<RemoveUnusedInviteCodes, TError, RemoveUnusedInviteCodesVariables, TContext>(
      useServerFetcher<RemoveUnusedInviteCodes, RemoveUnusedInviteCodesVariables>(RemoveUnusedInviteCodesDocument),
      options
    );
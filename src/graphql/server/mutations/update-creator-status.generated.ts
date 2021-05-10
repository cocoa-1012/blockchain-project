import * as Types from '../types-server.generated';

import { UserFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateCreatorStatusVariables = Types.Exact<{
  creatorStatus: Types.Scalars['Boolean'];
  userPublicKey: Types.Scalars['String'];
}>;


export type UpdateCreatorStatus = { updateCreatorStatus: UserFragment };


export const UpdateCreatorStatusDocument = /*#__PURE__*/ `
    mutation UpdateCreatorStatus($creatorStatus: Boolean!, $userPublicKey: String!) {
  updateCreatorStatus(
    updateCreatorStatus: $creatorStatus
    userPublicKey: $userPublicKey
  ) {
    ...UserFragment
  }
}
    ${UserFragment}`;
export const useUpdateCreatorStatus = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCreatorStatus, TError, UpdateCreatorStatusVariables, TContext>) => 
    useMutation<UpdateCreatorStatus, TError, UpdateCreatorStatusVariables, TContext>(
      useServerFetcher<UpdateCreatorStatus, UpdateCreatorStatusVariables>(UpdateCreatorStatusDocument),
      options
    );
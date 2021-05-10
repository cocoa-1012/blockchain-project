import * as Types from '../types-server.generated';

import { UserFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateCreatorMigrationVariables = Types.Exact<{
  userPublicKey: Types.Scalars['String'];
  isApproved: Types.Scalars['Boolean'];
}>;


export type UpdateCreatorMigration = { updateUserIsApprovedForMigrationAt: UserFragment };


export const UpdateCreatorMigrationDocument = /*#__PURE__*/ `
    mutation UpdateCreatorMigration($userPublicKey: String!, $isApproved: Boolean!) {
  updateUserIsApprovedForMigrationAt(
    userPublicKey: $userPublicKey
    isApproved: $isApproved
  ) {
    ...UserFragment
  }
}
    ${UserFragment}`;
export const useUpdateCreatorMigration = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCreatorMigration, TError, UpdateCreatorMigrationVariables, TContext>) => 
    useMutation<UpdateCreatorMigration, TError, UpdateCreatorMigrationVariables, TContext>(
      useServerFetcher<UpdateCreatorMigration, UpdateCreatorMigrationVariables>(UpdateCreatorMigrationDocument),
      options
    );
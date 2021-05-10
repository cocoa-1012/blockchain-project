import {
  useMutation,
  MutationTuple,
  MutationHookOptions,
} from '@apollo/client';

import { maybeGetAddress } from 'utils/users';

import { REMOVE_FOLLOW } from 'queries/server/mutations/follows';

import Follow from 'types/Follow';

export interface RemoveFollowData {
  follow: Follow;
}

interface RemoveFollowArgs extends MutationHookOptions {
  publicKey: string;
}

interface UseRemoveFollowArgs extends RemoveFollowArgs {
  token: string;
}

export default function useRemoveFollow({
  publicKey,
  token,
  onCompleted,
  refetchQueries,
}: UseRemoveFollowArgs): MutationTuple<RemoveFollowData, RemoveFollowArgs> {
  return useMutation<RemoveFollowData, RemoveFollowArgs>(REMOVE_FOLLOW, {
    variables: { publicKey: maybeGetAddress(publicKey) },
    context: { endpoint: 'server', token },
    onCompleted,
    refetchQueries,
  });
}

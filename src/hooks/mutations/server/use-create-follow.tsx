import {
  useMutation,
  MutationTuple,
  MutationHookOptions,
} from '@apollo/client';

import { CREATE_FOLLOW } from 'queries/server/mutations/follows';

import Follow from 'types/Follow';

import { maybeGetAddress } from 'utils/users';

export interface CreateFollowData {
  follow: Follow;
}

interface CreateFollowArgs extends MutationHookOptions {
  publicKey: string;
}

interface UseCreateFollowArgs extends CreateFollowArgs {
  token: string;
}

export default function useCreateFollow({
  publicKey,
  token,
  onCompleted,
  refetchQueries,
}: UseCreateFollowArgs): MutationTuple<CreateFollowData, CreateFollowArgs> {
  return useMutation<CreateFollowData, CreateFollowArgs>(CREATE_FOLLOW, {
    variables: { publicKey: maybeGetAddress(publicKey) },
    context: { endpoint: 'server', token },
    onCompleted,
    refetchQueries,
  });
}

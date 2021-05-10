import {
  useMutation,
  MutationTuple,
  MutationHookOptions,
} from '@apollo/client';

import { DELETE_SOCIAL_VERIFICATION } from 'queries/server/mutations/socialVerification';

interface DeleteSocialVerificationArgs extends MutationHookOptions {
  id: string;
}

interface UseDeleteSocialVerificationArgs extends DeleteSocialVerificationArgs {
  token: string;
}

export default function useDeleteSocialVerification({
  id,
  token,
  refetchQueries,
}: UseDeleteSocialVerificationArgs): MutationTuple<
  boolean,
  DeleteSocialVerificationArgs
> {
  return useMutation<boolean, DeleteSocialVerificationArgs>(
    DELETE_SOCIAL_VERIFICATION,
    {
      context: { endpoint: 'server', token },
      variables: { id },
      refetchQueries,
    }
  );
}

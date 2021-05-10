import {
  useMutation,
  MutationTuple,
  MutationHookOptions,
} from '@apollo/client';

import { OVERWRITE_INSTAGRAM_VERIFICATION } from 'queries/server/mutations/socialVerification';

interface OverwriteInstagramVerificationArgs extends MutationHookOptions {
  id: string;
}

interface UseOverwriteInstagramVerificationArgs
  extends OverwriteInstagramVerificationArgs {
  token: string;
}

export default function useOverwriteInstagramVerification({
  id,
  token,
}: UseOverwriteInstagramVerificationArgs): MutationTuple<
  boolean,
  OverwriteInstagramVerificationArgs
> {
  return useMutation<boolean, OverwriteInstagramVerificationArgs>(
    OVERWRITE_INSTAGRAM_VERIFICATION,
    {
      context: { endpoint: 'server', token },
      variables: { id },
    }
  );
}

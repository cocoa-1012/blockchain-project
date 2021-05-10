import {
  useMutation,
  MutationTuple,
  MutationHookOptions,
} from '@apollo/client';

import { CREATE_INSTAGRAM_VERIFICATION } from 'queries/server/mutations/socialVerification';

interface CreateInstagramVerificationArgs extends MutationHookOptions {
  code: string;
  redirectURI: string;
}

interface UseCreateInstagramVerificationArgs
  extends CreateInstagramVerificationArgs {
  token: string;
}

export default function useCreateInstagramVerification({
  code,
  redirectURI,
  token,
}: UseCreateInstagramVerificationArgs): MutationTuple<
  boolean,
  CreateInstagramVerificationArgs
> {
  return useMutation<boolean, CreateInstagramVerificationArgs>(
    CREATE_INSTAGRAM_VERIFICATION,
    {
      context: { endpoint: 'server', token },
      variables: { code, redirectURI },
    }
  );
}

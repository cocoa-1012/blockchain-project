import { useMutation, MutationTuple } from '@apollo/client';

import { CREATE_SOCIAL_VERIFICATION_VIA_URL } from 'queries/server/mutations/socialVerification';
import SocialVerification from 'types/SocialVerification';

export interface CreateSocialVerificationData {
  socialVerification: SocialVerification;
}

interface CreateSocialVerificationArgs {
  socialVerificationURL: string;
}

export default function useCreateSocialVerificationViaURL(
  token: string
): MutationTuple<CreateSocialVerificationData, CreateSocialVerificationArgs> {
  return useMutation<
    CreateSocialVerificationData,
    CreateSocialVerificationArgs
  >(CREATE_SOCIAL_VERIFICATION_VIA_URL, {
    context: { endpoint: 'server', token },
  });
}

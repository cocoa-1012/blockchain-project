import { gql } from '@apollo/client';
import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { ClientError } from 'graphql-request';

import { fndHasuraClient } from 'lib/clients/graphql';

import { QueryCacheKey } from 'types/Queries';
import SocialVerification from 'types/SocialVerification';

import { maybeGetAddress } from 'utils/users';

import { HasuraSocialVerificationFragment } from 'queries/hasura/hasura-fragments';

const GET_HASURA_SOCIAL_VERIFICATIONS = gql`
  query getUserSocialVerifications($publicKey: String!) {
    socialVerifications: social_verification(
      where: { user: { _eq: $publicKey }, isValid: { _eq: true } }
    ) {
      ...HasuraSocialVerificationFragment
    }
  }
  ${HasuraSocialVerificationFragment}
`;

interface SocialVerificationsArgs {
  publicKey: string;
}

async function getSocialVerifications({
  publicKey,
}: SocialVerificationsArgs): Promise<SocialVerificationsData> {
  const client = fndHasuraClient();
  return await client.request<SocialVerificationsData, SocialVerificationsArgs>(
    GET_HASURA_SOCIAL_VERIFICATIONS,
    { publicKey: maybeGetAddress(publicKey) }
  );
}

interface SocialVerificationsData {
  socialVerifications: SocialVerification[];
}

interface SocialVerificationsVariables
  extends SocialVerificationsArgs,
    UseQueryOptions<
      SocialVerificationsData,
      ClientError,
      SocialVerificationsData
    > {}

export default function useSocialVerifications({
  publicKey,
  refetchOnWindowFocus = false,
}: SocialVerificationsVariables): UseQueryResult<
  SocialVerificationsData,
  ClientError
> {
  return useQuery(
    [QueryCacheKey.SocialVerifications, publicKey],
    () => getSocialVerifications({ publicKey }),
    { enabled: Boolean(publicKey), refetchOnWindowFocus }
  );
}

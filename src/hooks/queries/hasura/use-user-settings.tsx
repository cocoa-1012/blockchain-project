import { gql } from '@apollo/client';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress } from 'utils/users';

import { UserSettings } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

const GET_HASURA_USER_SETTINGS = gql`
  query UserSettings($publicKey: String!) {
    user: user_by_pk(publicKey: $publicKey) {
      emailSettings: email_setting {
        auctions
        newNFT
      }
    }
  }
`;

export interface UserSettingsData {
  user: UserSettings;
}

interface UserSettingsArgs {
  publicKey: string;
}

interface UserSettingsVariables
  extends UseQueryOptions<UserSettingsData, ClientError, UserSettingsData>,
    UserSettingsArgs {}

export async function getUserSettings(
  publicKey: string
): Promise<UserSettingsData> {
  const client = fndHasuraClient();
  return await client.request<UserSettingsData, UserSettingsArgs>(
    GET_HASURA_USER_SETTINGS,
    {
      publicKey: maybeGetAddress(publicKey),
    }
  );
}

export default function useUserSettings({
  publicKey,
  refetchOnWindowFocus = false,
  enabled = true,
}: UserSettingsVariables): UseQueryResult<UserSettingsData, ClientError> {
  return useQuery(
    [QueryCacheKey.UserSettings, { publicKey }],
    () => getUserSettings(publicKey),
    {
      refetchOnWindowFocus,
      enabled: Boolean(publicKey) && enabled,
    }
  );
}

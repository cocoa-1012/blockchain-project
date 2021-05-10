import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from 'react-query';
import { gql } from '@apollo/client';

import { ClientError } from 'graphql-request';

import { fndServerClient } from 'lib/clients/graphql';

import { EmailSettings } from 'types/Account';

const UPDATE_USER_SETTINGS = gql`
  mutation UpdateEmailSettings(
    $publicKey: String!
    $data: EmailSettingUpdate!
  ) {
    updateEmailSetting(publicKey: $publicKey, data: $data) {
      newNFT
      auctions
    }
  }
`;

export async function updateUserSettings({
  token,
  publicKey,
  data,
}: UpdateUserSettingsArgs): Promise<UpdateUserSettingsData> {
  const client = fndServerClient(token);
  return await client.request<
    UpdateUserSettingsData,
    Omit<UpdateUserSettingsArgs, 'token'>
  >(UPDATE_USER_SETTINGS, {
    publicKey,
    data,
  });
}

interface UpdateUserSettingsArgs {
  token: string;
  publicKey: string;
  data: EmailSettings;
}

interface UpdateUserSettingsData {
  updateEmailSetting: EmailSettings;
}

type UpdateUserSettingsVariables = UseMutationOptions;

export default function useUpdateUserSettings(): UseMutationResult<
  UpdateUserSettingsData,
  ClientError,
  UpdateUserSettingsArgs
> {
  return useMutation(updateUserSettings);
}

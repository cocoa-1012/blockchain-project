import { gql } from '@apollo/client';
import { getAddress } from '@ethersproject/address';

import { fndServerClient } from 'lib/clients/graphql';
import ModerationStatus from 'types/ModerationStatus';

export interface SetProfileModerationProxyProps {
  id: string;
  moderationStatus: ModerationStatus;
  token: string;
  adminAddress: string;
  url: string;
}

export async function setProfileModerationProxy({
  id,
  moderationStatus,
  token,
  adminAddress,
  url,
}: SetProfileModerationProxyProps): Promise<{ done: boolean }> {
  const res = await fetch('/api/admin/moderate-profile', {
    method: 'POST',
    body: JSON.stringify({ id, moderationStatus, token, adminAddress, url }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('An error occurred at this endpoint');
}

interface SetProfileModerationStatusProps {
  token: string;
  id: string;
  moderationStatus: ModerationStatus;
}

const SET_PROFILE_MODERATION_STATUS = gql`
  mutation setProfileModerationStatus(
    $publicKey: String!
    $moderationStatus: UserModerationStatus!
  ) {
    updateUserModerationStatus(
      userPublicKey: $publicKey
      moderationStatus: $moderationStatus
    ) {
      moderationStatus
    }
  }
`;

export async function setProfileModerationStatus({
  token,
  id,
  moderationStatus,
}: SetProfileModerationStatusProps): Promise<{
  updateUserModerationStatus: { moderationStatus: ModerationStatus };
}> {
  const client = fndServerClient(token);
  return await client.request(SET_PROFILE_MODERATION_STATUS, {
    publicKey: getAddress(id),
    moderationStatus,
  });
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { gql } from '@apollo/client';
import { getAddress } from '@ethersproject/address';

import { fndHasuraClient } from 'lib/clients/graphql';

import Account from 'types/Account';
import ModerationStatus from 'types/ModerationStatus';

export const HASURA_USER_FLAGGED_ARTWORKS = gql`
  query hasuraUserModeratedArtworks(
    $publicKey: String!
    $excludedModerationStatuses: [artwork_moderationstatus_enum!]
  ) {
    user: user_by_pk(publicKey: $publicKey) {
      publicKey
      isAdmin
      moderationStatus
      artworks(
        where: { moderationStatus: { _nin: $excludedModerationStatuses } }
      ) {
        moderationStatus
        publicKey
        tokenId
      }
    }
  }
`;

interface FlaggedArtworksData {
  user: Account;
}

export async function getUserFlaggedArtworks(
  publicKey: string
): Promise<FlaggedArtworksData> {
  const client = fndHasuraClient();
  return await client.request<FlaggedArtworksData>(
    HASURA_USER_FLAGGED_ARTWORKS,
    {
      publicKey: getAddress(publicKey),
      excludedModerationStatuses: [ModerationStatus.Active],
    }
  );
}

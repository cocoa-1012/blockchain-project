/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { gql } from '@apollo/client';
import { HasuraArtworksQueryArgs } from 'hooks/queries/server/types';
import { fndHasuraClient } from 'lib/clients/graphql';

import { castTokenIds } from 'utils/helpers';

import Artwork from 'types/Artwork';
import ModerationStatus from 'types/ModerationStatus';

import { HasuraArtworkFragment, HasuraUserFragment } from './hasura-fragments';

export const HASURA_PUBLIC_ARTWORKS_QUERY = gql`
  query hasuraPublicArtworksByTokenIds(
    $tokenIds: [Int!]!
    $excludeHidden: Boolean!
    $moderationStatuses: [artwork_moderationstatus_enum!]
    $userModerationStatuses: [user_moderationstatus_enum!]
  ) {
    artworks: artwork(
      where: {
        tokenId: { _in: $tokenIds }
        # Always exclude deleted works (goerli example 105)
        deletedAt: { _is_null: true }
        # which statuses to include (will be ACTIVE by default)
        moderationStatus: { _in: $moderationStatuses }
        # artworks of creators under review shouldn’t show publicly
        user: {
          moderationStatus: { _in: $userModerationStatuses }
          socialVerifications: { isValid: { _eq: true } }
        }
        # Respect the excludeHidden flag
        _or: [
          # Always include artwork where neither the art or the user are hidden
          {
            _and: [
              { hiddenAt: { _is_null: true } }
              { user: { hiddenAt: { _is_null: true } } }
            ]
          }
          # Support excludeHidden: false
          {
            _or: [
              # Optionally include when art is hidden but the user is not (goerli example 229)
              {
                _and: [
                  { hiddenAt: { _is_null: $excludeHidden } }
                  { user: { hiddenAt: { _is_null: true } } }
                ]
              }
              # Optionally include when the user is hidden but the art is not (goerli example 30)
              {
                _and: [
                  { hiddenAt: { _is_null: true } }
                  { user: { hiddenAt: { _is_null: $excludeHidden } } }
                ]
              }
              # Optionally include when both the art and user are hidden (goerli example 262)
              {
                _and: [
                  { hiddenAt: { _is_null: $excludeHidden } }
                  { user: { hiddenAt: { _is_null: $excludeHidden } } }
                ]
              }
            ]
          }
        ]
      }
    ) {
      ...HasuraArtworkFragment
      creator: user {
        ...HasuraUserFragment
      }
    }
  }
  ${HasuraArtworkFragment}
  ${HasuraUserFragment}
`;

interface ArtworksData {
  artworks: Artwork[];
}

interface ArtworksArgs extends Omit<HasuraArtworksQueryArgs, 'tokenIds'> {
  tokenIds: number[];
}

export async function getHasuraPublicArtworks({
  tokenIds,
}: HasuraArtworksQueryArgs): Promise<ArtworksData> {
  const client = fndHasuraClient();

  return await client.request<ArtworksData, ArtworksArgs>(
    HASURA_PUBLIC_ARTWORKS_QUERY,
    {
      tokenIds: castTokenIds(tokenIds),
      excludeHidden: true,
      moderationStatuses: [ModerationStatus.Active],
      userModerationStatuses: [ModerationStatus.Active],
    }
  );
}

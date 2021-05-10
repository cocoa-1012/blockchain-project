/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { gql } from '@apollo/client';

import { castTokenIds, getFirstValue } from 'utils/helpers';

import { ALL_ARTWORK_MODERATION_STATUSES } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';
import { HasuraArtworkFragment, HasuraUserFragment } from './hasura-fragments';

import Artwork from 'types/Artwork';
import ModerationStatus from 'types/ModerationStatus';

import {
  HasuraArtworkQueryArgs,
  HasuraArtworksByPublicKeysQueryArgs,
  HasuraArtworksQueryArgs,
} from 'hooks/queries/server/types';
import { filterNonUserStatuses } from 'utils/moderation';

export const HASURA_ARTWORKS_QUERY = gql`
  query hasuraArtworksByTokenIds(
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
        user: { moderationStatus: { _in: $userModerationStatuses } }
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

interface ArtworksResponse {
  artworks: Artwork[];
}

export async function getHasuraArtworks({
  tokenIds,
  excludeHidden = true,
  moderationStatuses = [ModerationStatus.Active],
}: HasuraArtworksQueryArgs): Promise<ArtworksResponse> {
  const client = fndHasuraClient();

  return await client.request<ArtworksResponse>(HASURA_ARTWORKS_QUERY, {
    tokenIds: castTokenIds(tokenIds),
    excludeHidden,
    moderationStatuses,
    userModerationStatuses: filterNonUserStatuses(moderationStatuses),
  });
}

export async function getHasuraArtworkByTokenId({
  tokenId,
  excludeHidden = true,
  moderationStatuses = ALL_ARTWORK_MODERATION_STATUSES,
}: HasuraArtworkQueryArgs): Promise<Artwork> {
  const { artworks } = await getHasuraArtworks({
    tokenIds: [tokenId],
    excludeHidden,
    moderationStatuses,
    userModerationStatuses: filterNonUserStatuses(moderationStatuses),
  });
  return getFirstValue(artworks);
}

export const GET_HASURA_USER_ARTWORKS = gql`
  query getHasuraUserArtworks($publicKey: String!) {
    user: user_by_pk(publicKey: $publicKey) {
      ...HasuraUserFragment
      artworks(where: { deletedAt: { _is_null: true } }) {
        ...HasuraArtworkFragment
      }
    }
  }
  ${HasuraArtworkFragment}
  ${HasuraUserFragment}
`;

export const GET_HASURA_ARTWORK_BY_ID = gql`
  query getArtwork($id: uuid!) {
    artwork: artwork_by_pk(id: $id) {
      ...HasuraArtworkFragment
      creator: user {
        ...HasuraUserFragment
      }
    }
  }
  ${HasuraArtworkFragment}
  ${HasuraUserFragment}
`;

interface ArtworkResponse {
  artwork: Artwork;
}

export async function getHasuraArtworkById(
  artworkId: string
): Promise<ArtworkResponse> {
  const client = fndHasuraClient();
  return await client.request<ArtworkResponse>(GET_HASURA_ARTWORK_BY_ID, {
    id: artworkId,
  });
}

export const GET_HASURA_ARTWORKS_BY_IPFS_PATH = gql`
  query getHasuraArtworksByIPFSPath(
    $assetIPFSPath: String!
    $publicKey: String!
  ) {
    artworks: artwork(
      where: {
        user: { publicKey: { _eq: $publicKey } }
        assetIPFSPath: { _eq: $assetIPFSPath }
        deletedAt: { _is_null: true }
      }
    ) {
      ...HasuraArtworkFragment
    }
  }
  ${HasuraArtworkFragment}
`;

export const HASURA_ARTWORKS_BY_PUBLIC_KEYS_QUERY = gql`
  query hasuraArtworksByPublicKeys(
    $publicKeys: [String!]!
    $excludeHidden: Boolean!
    $moderationStatuses: [artwork_moderationstatus_enum!]
    $userModerationStatuses: [user_moderationstatus_enum!]
  ) {
    artworks: artwork(
      where: {
        publicKey: { _in: $publicKeys }
        # Always exclude deleted works (goerli example 105)
        deletedAt: { _is_null: true }
        # which statuses to include (will be ACTIVE by default)
        moderationStatus: { _in: $moderationStatuses }
        # artworks of creators under review shouldn’t show publicly
        user: { moderationStatus: { _in: $userModerationStatuses } }
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

export async function getHasuraArtworksByPublicKeys({
  publicKeys,
  excludeHidden = true,
  moderationStatuses = [ModerationStatus.Active],
}: HasuraArtworksByPublicKeysQueryArgs): Promise<ArtworksResponse> {
  const client = fndHasuraClient();

  return await client.request<ArtworksResponse>(
    HASURA_ARTWORKS_BY_PUBLIC_KEYS_QUERY,
    {
      publicKeys: publicKeys,
      excludeHidden,
      moderationStatuses,
      userModerationStatuses: filterNonUserStatuses(moderationStatuses),
    }
  );
}

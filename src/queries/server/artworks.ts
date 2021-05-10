import { gql } from '@apollo/client';

import {
  ArtworkFragment,
  ArtworkFragmentPrivate,
} from 'queries/server/server-fragments';

export const GET_ARTWORK_UNLOCKABLE_CONTENT_BY_TOKEN_ID = gql`
  query artworkDownloadableUrlByTokenId($tokenId: String!) {
    artwork: artworkDownloadableUrlByTokenId(tokenId: $tokenId) {
      downloadableUrl
    }
  }
`;

export const GET_ARTWORK_UNLOCKABLE_CONTENT = gql`
  query artworkDownloadableUrl($id: String!) {
    artwork: artworkDownloadableUrl(id: $id) {
      downloadableUrl
    }
  }
`;

export const CREATE_ARTWORK = gql`
  mutation createArtwork($data: CreateArtworkInput!) {
    createArtwork(data: $data) {
      ...ArtworkFragmentPrivate
    }
  }
  ${ArtworkFragmentPrivate}
`;

export const UPDATE_ARTWORK = gql`
  mutation updateDraftArtwork($data: UpdateDraftArtworkInput!) {
    updateDraftArtwork(data: $data) {
      ...ArtworkFragmentPrivate
    }
  }
  ${ArtworkFragmentPrivate}
`;

export const UPDATE_ARTWORK_TO_MINTING = gql`
  mutation setDraftArtworkToMinting($id: String!, $mintTxHash: String!) {
    setDraftArtworkToMinting(id: $id, mintTxHash: $mintTxHash) {
      ...ArtworkFragmentPrivate
    }
  }
  ${ArtworkFragmentPrivate}
`;

// Note: Technically deletion is a write, but no reason
// that downloadableUrl would be involved, so we use
// the Read version
export const DELETE_DRAFT_ARTWORK = gql`
  mutation deleteDraftArtwork($id: String!) {
    deleteDraftArtwork(id: $id) {
      ...ArtworkFragment
    }
  }
  ${ArtworkFragment}
`;

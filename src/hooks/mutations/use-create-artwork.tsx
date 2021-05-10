import { useMutation } from '@apollo/client';

import Artwork from 'types/Artwork';

import { CREATE_ARTWORK } from 'queries/server/artworks';

interface ArtworkData {
  createArtwork: Artwork;
}

interface ArtworkInputData {
  name?: string;
  description?: string;
  assetIPFSPath: string;
  metadataIPFSPath?: string;
  downloadableUrl?: string;
  width: number;
  height: number;
  duration?: number;
  mimeType: string;
}

interface ArtworkArgs {
  data: ArtworkInputData;
}

export default function useCreateArtwork(token: string) {
  return useMutation<ArtworkData, ArtworkArgs>(CREATE_ARTWORK, {
    context: { endpoint: 'server', token },
  });
}

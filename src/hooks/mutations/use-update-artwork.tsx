import { MutationTuple, useMutation } from '@apollo/client';

import Artwork from 'types/Artwork';

import {
  UPDATE_ARTWORK,
  UPDATE_ARTWORK_TO_MINTING,
} from 'queries/server/artworks';

interface ArtworkData {
  updateArtwork: Artwork;
}

interface ArtworkInputData {
  id: string;
  metadataIPFSPath?: string;
  name: string;
  description: string;
  downloadableUrl?: string;
}

interface ArtworkArgs {
  data: ArtworkInputData;
}

interface UpdateArtworkToMintingArgs {
  id: string;
  mintTxHash: string;
}

export default function useUpdateArtwork(
  token: string
): MutationTuple<ArtworkData, ArtworkArgs> {
  return useMutation<ArtworkData, ArtworkArgs>(UPDATE_ARTWORK, {
    context: { endpoint: 'server', token },
  });
}

export function useUpdateArtworkToMinting(
  token: string
): MutationTuple<ArtworkData, UpdateArtworkToMintingArgs> {
  return useMutation<ArtworkData, UpdateArtworkToMintingArgs>(
    UPDATE_ARTWORK_TO_MINTING,
    {
      context: { endpoint: 'server', token },
    }
  );
}

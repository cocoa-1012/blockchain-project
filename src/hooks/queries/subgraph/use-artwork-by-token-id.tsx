import { POLL_INTERVAL_VIDEO } from 'lib/constants';
import { useQuery, QueryResult } from '@apollo/client';

import {
  GET_NFT_BY_TOKEN_ID_INCLUDING_BURNED,
  GET_NFT_BY_TOKEN_ID,
} from 'queries/subgraph/artworks';

import Artwork from 'types/Artwork';

interface ArtworkByTokenIdData {
  artworks: Artwork[];
}

interface ArtworkByTokenIdArgs {
  tokenId: string;
}

export default function useSubgraphArtworkByTokenIdWithPolling(
  tokenId: string
): QueryResult<ArtworkByTokenIdData> {
  return useQuery<ArtworkByTokenIdData, ArtworkByTokenIdArgs>(
    GET_NFT_BY_TOKEN_ID,
    {
      variables: { tokenId: tokenId },
      skip: !tokenId,
      pollInterval: POLL_INTERVAL_VIDEO,
      context: { endpoint: 'subgraph' },
    }
  );
}

export function useSubgraphArtworkByTokenIdWithPollingIncludingBurned(
  tokenId: string
): QueryResult<ArtworkByTokenIdData> {
  return useQuery<ArtworkByTokenIdData, ArtworkByTokenIdArgs>(
    GET_NFT_BY_TOKEN_ID_INCLUDING_BURNED,
    {
      variables: { tokenId: tokenId },
      skip: !tokenId,
      pollInterval: POLL_INTERVAL_VIDEO,
      context: { endpoint: 'subgraph' },
    }
  );
}

// TODO: See if this is the only instance of this
export function useSubgraphArtworkByTokenId(
  tokenId: string
): QueryResult<ArtworkByTokenIdData> {
  return useQuery<ArtworkByTokenIdData, ArtworkByTokenIdArgs>(
    GET_NFT_BY_TOKEN_ID,
    {
      variables: { tokenId: tokenId },
      skip: !tokenId,
      context: { endpoint: 'subgraph' },
    }
  );
}

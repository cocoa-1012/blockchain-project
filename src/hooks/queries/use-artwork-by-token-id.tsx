import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { ClientError } from 'graphql-request';

import { getGraphAndServerArtwork } from 'queries/artworks';

import Artwork from 'types/Artwork';
import { QueryCacheKey } from 'types/Queries';

interface ArtworkByTokenIdVariables
  extends UseQueryOptions<Artwork, ClientError, Artwork> {
  tokenId: string;
}

export default function useArtworkByTokenId({
  tokenId,
  refetchOnWindowFocus = false,
  refetchInterval = false,
}: ArtworkByTokenIdVariables): UseQueryResult<Artwork, ClientError> {
  return useQuery(
    [QueryCacheKey.ArtworkByTokenId, { tokenId }],
    () => getGraphAndServerArtwork({ tokenId, excludeHidden: false }),
    {
      enabled: Boolean(tokenId),
      refetchOnWindowFocus,
      refetchInterval,
    }
  );
}

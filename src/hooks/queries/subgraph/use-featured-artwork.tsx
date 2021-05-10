import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import Artwork from 'types/Artwork';

import { getGraphAndServerArtwork } from 'queries/artworks';

interface FeaturedArtwork {
  artwork: Artwork;
}
interface FeaturedArtworkVariables
  extends UseQueryOptions<Artwork, ClientError, Artwork>,
    FeaturedArtwork {}

export default function useFeaturedArtwork({
  artwork,
  // refetch every 15s (15,000ms)
  refetchInterval = 15 * 1000,

  staleTime = 0,
  // no need for event refetches as we have the interval
  refetchOnWindowFocus = false,
}: FeaturedArtworkVariables): UseQueryResult<Artwork, ClientError> {
  const tokenId = artwork?.tokenId;
  return useQuery(
    ['getGraphAndServerArtwork', { tokenId }],
    () => getGraphAndServerArtwork({ tokenId }),
    {
      enabled: Boolean(tokenId),
      initialData: artwork,
      // refetch on mount
      staleTime,
      refetchInterval,
      refetchOnWindowFocus,
    }
  );
}

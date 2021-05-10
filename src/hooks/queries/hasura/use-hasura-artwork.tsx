import { useQuery, QueryResult, QueryHookOptions } from '@apollo/client';

import Artwork from 'types/Artwork';

import { GET_HASURA_ARTWORK_BY_ID } from 'queries/hasura/artworks';

interface ArtworkData {
  artwork: Artwork;
}
interface ArtworkArgs extends QueryHookOptions {
  id: string;
}

export default function useHasuraArtwork({
  id,
  pollInterval,
  skip,
}: ArtworkArgs): QueryResult<ArtworkData, ArtworkArgs> {
  return useQuery<ArtworkData, ArtworkArgs>(GET_HASURA_ARTWORK_BY_ID, {
    variables: { id },
    skip: !id || skip,
    context: { endpoint: 'hasura' },
    pollInterval,
  });
}

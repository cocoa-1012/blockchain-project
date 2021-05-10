import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  ArtworksByTags,
  ArtworksByTagsDocument,
  ArtworksByTagsVariables,
  useArtworksByTags as useArtworksByTagsBaseHook,
} from 'graphql/hasura/queries/artworks-by-tags.generated';

import { ArtworkV2 } from 'types/Artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { getNextPageParam } from 'utils/artwork/artwork';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getArtworksByTags(variables: ArtworksByTagsVariables) {
  const client = fndHasuraClient();
  const data = await client.request<ArtworksByTags, ArtworksByTagsVariables>(
    ArtworksByTagsDocument,
    variables
  );
  return data.artworks;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useArtworksByTags(
  variables: ArtworksByTagsVariables,
  options?: UseInfiniteQueryOptions<ArtworkV2[], ClientError, ArtworkV2[]>
) {
  const { tag } = variables;
  return useInfiniteQuery(
    useArtworksByTagsBaseHook.getKey(variables),
    ({ pageParam = 0 }) =>
      getArtworksByTags({
        ...variables,
        tag,
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    { ...options, enabled: Boolean(tag), getNextPageParam }
  );
}

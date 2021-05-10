import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  UserArtworksCollected,
  UserArtworksCollectedDocument,
  UserArtworksCollectedVariables,
} from 'graphql/hasura/queries/user-artworks-collected.generated';

import { ArtworkV2 } from 'types/Artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress } from 'utils/users';
import {
  getNextPageParam,
  rejectUserHiddenArtworks,
} from 'utils/artwork/artwork';

export async function getUserArtworksCollected(
  variables: UserArtworksCollectedVariables
) {
  const client = fndHasuraClient();
  const data = await client.request<
    UserArtworksCollected,
    UserArtworksCollectedVariables
  >(UserArtworksCollectedDocument, variables);
  return rejectUserHiddenArtworks(data.artworks);
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserArtworksCollected(
  variables: UserArtworksCollectedVariables,
  options?: UseInfiniteQueryOptions<ArtworkV2[], ClientError, ArtworkV2[]>
) {
  const { publicKey } = variables;
  return useInfiniteQuery(
    ['UserArtworksCollected', variables],
    ({ pageParam = 0 }) =>
      getUserArtworksCollected({
        ...variables,
        publicKey: maybeGetAddress(publicKey),
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    { ...options, enabled: Boolean(publicKey), getNextPageParam }
  );
}

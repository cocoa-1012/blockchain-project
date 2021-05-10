import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  UserArtworksCreated,
  UserArtworksCreatedDocument,
  UserArtworksCreatedVariables,
} from 'graphql/hasura/queries/user-artworks-created.generated';

import { ArtworkV2 } from 'types/Artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress } from 'utils/users';
import { getNextPageParam } from 'utils/artwork/artwork';

export async function getUserArtworksCreated(
  variables: UserArtworksCreatedVariables
) {
  const client = fndHasuraClient();
  const data = await client.request<
    UserArtworksCreated,
    UserArtworksCreatedVariables
  >(UserArtworksCreatedDocument, variables);
  return data.artworks;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserArtworksCreated(
  variables: UserArtworksCreatedVariables,
  options?: UseInfiniteQueryOptions<ArtworkV2[], ClientError, ArtworkV2[]>
) {
  const { publicKey } = variables;
  return useInfiniteQuery(
    ['UserArtworksCreated', variables],
    ({ pageParam = 0 }) =>
      getUserArtworksCreated({
        ...variables,
        publicKey: maybeGetAddress(publicKey),
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    { ...options, enabled: Boolean(publicKey), getNextPageParam }
  );
}

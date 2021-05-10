import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  UserArtworksHidden,
  UserArtworksHiddenDocument,
  UserArtworksHiddenVariables,
} from 'graphql/hasura/queries/user-artworks-hidden.generated';

import { ArtworkV2 } from 'types/Artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress } from 'utils/users';
import { getNextPageParam } from 'utils/artwork/artwork';

async function getUserArtworksHidden(variables: UserArtworksHiddenVariables) {
  const client = fndHasuraClient();
  const data = await client.request<
    UserArtworksHidden,
    UserArtworksHiddenVariables
  >(UserArtworksHiddenDocument, variables);
  return data.artworks;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserArtworksHidden(
  variables: UserArtworksHiddenVariables,
  options?: UseInfiniteQueryOptions<ArtworkV2[], ClientError, ArtworkV2[]>
) {
  const { publicKey } = variables;
  return useInfiniteQuery(
    ['UserArtworksHidden', variables],
    ({ pageParam = 0 }) =>
      getUserArtworksHidden({
        ...variables,
        publicKey: maybeGetAddress(publicKey),
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    { ...options, enabled: Boolean(publicKey), getNextPageParam }
  );
}

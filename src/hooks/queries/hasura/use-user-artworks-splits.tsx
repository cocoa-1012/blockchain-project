import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import {
  UserArtworksSplits,
  UserArtworksSplitsDocument,
  UserArtworksSplitsVariables,
} from 'graphql/hasura/queries/user-artworks-splits.generated';

import { ArtworkV2 } from 'types/Artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress } from 'utils/users';
import {
  getNextPageParam,
  rejectUserHiddenArtworks,
} from 'utils/artwork/artwork';

async function getUserArtworksSplits(variables: UserArtworksSplitsVariables) {
  const client = fndHasuraClient();
  const query = await client.request<
    UserArtworksSplits,
    UserArtworksSplitsVariables
  >(UserArtworksSplitsDocument, variables);
  return rejectUserHiddenArtworks(query.artworks);
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserArtworksSplits(
  variables: UserArtworksSplitsVariables,
  options?: UseInfiniteQueryOptions<ArtworkV2[], ClientError, ArtworkV2[]>
) {
  const { publicKey } = variables;
  return useInfiniteQuery(
    ['UserArtworksSplits', variables],
    ({ pageParam = 0 }) =>
      getUserArtworksSplits({
        ...variables,
        publicKey: maybeGetAddress(publicKey),
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    { ...options, enabled: Boolean(publicKey), getNextPageParam }
  );
}

import {
  UseInfiniteQueryResult,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from 'react-query';
import { gql } from '@apollo/client';
import { ClientError } from 'graphql-request';

import { fndHasuraClient } from 'lib/clients/graphql';
import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

import { ArtworkEventFromDB } from 'types/Event';

import { maybeGetAddress } from 'utils/users';
import { mergeServerArtworks } from 'utils/transforms';
import { getNextPageParam } from 'utils/artwork/artwork';

import {
  HasuraArtworkFragment,
  HasuraUserFragment,
  HasuraUserFragmentLight,
} from 'queries/hasura/hasura-fragments';

import { getGraphArtworksByTokenIdsWithBids } from 'queries/artworks';
import { QueryCacheKey } from 'types/Queries';
import { pick } from 'ramda';
import Artwork from 'types/Artwork';

const HASURA_FOLLOWED_ARTWORK_EVENTS = gql`
  query hasuraFollowedArtworks(
    $publicKey: String!
    $offset: Int!
    $limit: Int!
  ) {
    events: event(
      where: {
        follower: { user: { _eq: $publicKey }, isFollowing: { _eq: true } }
        artwork: {
          moderationStatus: { _eq: "ACTIVE" }
          status: { _eq: "MINTED" }
          hiddenAt: { _is_null: true }
          deletedAt: { _is_null: true }
          tokenId: { _is_null: false }
        }
        eventType: {
          _nin: [
            "MIGRATE_CREATOR"
            "MIGRATE_CREATOR_PAYMENT_ADDRESS"
            "MIGRATE_OWNER"
            "MIGRATE_SELLER"
            "UNLIST"
            "SELL" # this is an unreliable subgraph event to be ignored
            "SETTLE" # Feels more of a administrative task
            "TRANSFER"
          ]
        }
      }
      order_by: { blockTimestamp: desc }
      limit: $limit
      offset: $offset
    ) {
      publicKey
      eventType
      data
      tokenId
      tokenCreator
      blockTimestamp
      user {
        ...HasuraUserFragmentLight
      }
      artwork {
        ...HasuraArtworkFragment
        creator: user {
          ...HasuraUserFragment
        }
      }
    }
  }
  ${HasuraArtworkFragment}
  ${HasuraUserFragment}
  ${HasuraUserFragmentLight}
`;

async function getFollowedArtworkEvents({ publicKey, offset, limit }) {
  const client = fndHasuraClient();
  const { events } = await client.request<{ events: ArtworkEventFromDB[] }>(
    HASURA_FOLLOWED_ARTWORK_EVENTS,
    {
      publicKey: maybeGetAddress(publicKey),
      offset,
      limit,
    }
  );

  const artworksWithEvent = events.map((event) => {
    const artworkEventFields = pick([
      'publicKey',
      'eventType',
      'data',
      'tokenId',
      'tokenCreator',
      'blockTimestamp',
      'user',
    ])(event);
    const refactoredArtwork = { ...event.artwork, event: artworkEventFields };

    return refactoredArtwork;
  });

  const artworkTokenIds = artworksWithEvent.map((artwork) => artwork.tokenId);
  const query = await getGraphArtworksByTokenIdsWithBids({
    tokenIds: artworkTokenIds,
  });
  return mergeServerArtworks({
    serverArtworks: artworksWithEvent,
    graphArtworks: query.artworks,
  });
}

interface FollowedArtworksArgs
  extends UseInfiniteQueryOptions<Artwork[], ClientError, Artwork[]> {
  publicKey: string;
}

export default function useFollowedArtworkEvents({
  publicKey,
  refetchOnWindowFocus = false,
  refetchOnMount = 'always',
}: FollowedArtworksArgs): UseInfiniteQueryResult<Artwork[], ClientError> {
  return useInfiniteQuery(
    [QueryCacheKey.FollowedArtworks, { publicKey }],
    ({ pageParam = 0 }) => {
      return getFollowedArtworkEvents({
        publicKey,
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      });
    },
    {
      enabled: Boolean(publicKey),
      refetchOnWindowFocus,
      refetchOnMount,
      getNextPageParam,
    }
  );
}

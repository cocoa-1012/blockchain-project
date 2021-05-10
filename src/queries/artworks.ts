/* eslint-disable max-lines */
import { gql } from '@apollo/client';
import { map, prop } from 'ramda';

import { NftFragment } from 'queries/subgraph/fragments';

import { fndGraphClient } from 'lib/clients/graphql';

import { mergeArtwork, mergeGraphArtworksIfInDB } from 'utils/transforms';
import { getArtworkIds } from 'utils/artwork/artwork';
import { rejectNils } from 'utils/helpers';

import Artwork from 'types/Artwork';
import Auction from 'types/Auction';

import {
  GET_ARTWORKS_BY_TOKEN_IDS,
  getGraphArtworkByTokenId,
  GET_ARTWORKS_BY_TOKEN_IDS_INCLUDING_BIDS,
  GET_ARTWORKS_BY_PUBLIC_KEYS,
} from 'queries/subgraph/artworks';

import {
  getHasuraArtworkByTokenId,
  getHasuraArtworks,
  getHasuraArtworksByPublicKeys,
} from './hasura/artworks';
import {
  HasuraArtworkQueryArgs,
  HasuraArtworksByPublicKeysQueryArgs,
  HasuraArtworksQueryArgs,
} from 'hooks/queries/server/types';
import { getHasuraPublicArtworks } from './hasura/artworks-public';
import { maybeLowerCase } from 'utils/case';

const NUM_BIDS_MULTIPLE = 5;
const BID_VOL_MULTIPLE = 1;

interface ArtworksData {
  artworks: Artwork[];
}

export async function getMergedPublicArtworks(
  artworks: Artwork[]
): Promise<Artwork[]> {
  const tokenIds = getArtworkIds(artworks);

  const query = await getHasuraPublicArtworks({ tokenIds });

  const mergedProducts = mergeGraphArtworksIfInDB({
    serverArtworks: query.artworks,
    graphArtworks: artworks,
  });

  return mergedProducts;
}

export const NFT_TRENDING_ARTWORKS_QUERY = gql`
  query trendingArtworksQuery($limit: Int, $now: Int) {
    auctions: nftMarketAuctions(
      where: { status: Open, dateEnding_gt: $now, highestBid_not: null }
      orderBy: numberOfBids
      orderDirection: desc
      first: $limit
    ) {
      auctionId
      bidVolumeInETH
      numberOfBids
      dateEnding
      nft {
        ...NftFragment
      }
    }
  }
  ${NftFragment}
`;

interface GetGraphAndServerTrendingArtworksArgs {
  limit: number;
  now?: number;
}

/**
 * This logic should eventually live in the backend/subgraph.
 * Doing it client side for now since it's easier to iterate on.
 *
 * Dampens num bids based on how much time left is in the auction.
 */
export function scoreTrendingArtwork(artwork): number {
  const numBidsFactor =
    Math.max(Number(artwork.numberOfBids) - 1, 0) * NUM_BIDS_MULTIPLE;
  const bidVolFactor = Number(artwork.bidVolumeInETH) * BID_VOL_MULTIPLE;
  const timeLeftFactor =
    (Number(artwork.dateEnding) - Math.floor(Date.now() / 1000)) / 3600; // Hours left
  return numBidsFactor / Math.max(1, timeLeftFactor ** 2) + bidVolFactor;
}

export async function getGraphAndServerTrendingArtworks({
  limit = 16,
  now = Math.round(Date.now() / 1000),
}: GetGraphAndServerTrendingArtworksArgs): Promise<ArtworksData> {
  const client = fndGraphClient();
  const graphQuery = await client.request<{ auctions: Auction[] }>(
    NFT_TRENDING_ARTWORKS_QUERY,
    { limit, now }
  );

  const artworks = map<Auction, any>(prop('nft'), graphQuery.auctions);

  const mergedArtworks = await getMergedPublicArtworks(artworks);

  const order = graphQuery.auctions.map((a) => ({
    tokenId: a.nft.tokenId,
    bidVolumeInETH: a.bidVolumeInETH,
    numberOfBids: a.numberOfBids,
    dateEnding: a.dateEnding,
  }));

  const sortedArtworks = mergedArtworks.sort((a, b) => {
    const artwork1 = order.find((o) => o.tokenId === a.tokenId);
    const artwork2 = order.find((o) => o.tokenId === b.tokenId);

    return scoreTrendingArtwork(artwork2) - scoreTrendingArtwork(artwork1);
  });

  return { artworks: sortedArtworks };
}

export async function getGraphAndServerArtwork({
  tokenId,
  excludeHidden = true,
}: HasuraArtworkQueryArgs): Promise<Artwork> {
  const [serverArtwork, graphArtwork] = await Promise.all([
    getHasuraArtworkByTokenId({ tokenId, excludeHidden }),
    getGraphArtworkByTokenId(tokenId),
  ]);
  if (!serverArtwork) {
    return null;
  }
  const mergedArtwork = mergeArtwork(graphArtwork, serverArtwork);
  return mergedArtwork;
}

interface GetGraphArtworksByTokenIdsArgs {
  tokenIds: string[];
  first?: number;
}

interface GetGraphArtworksByPublicKeysArgs {
  publicKeys: string[];
  first?: number;
}

export async function getGraphArtworksByTokenIds({
  tokenIds,
  first = 100,
}: GetGraphArtworksByTokenIdsArgs): Promise<ArtworksData> {
  const client = fndGraphClient();
  return await client.request<ArtworksData, GetGraphArtworksByTokenIdsArgs>(
    GET_ARTWORKS_BY_TOKEN_IDS,
    { tokenIds: rejectNils(tokenIds), first }
  );
}

export async function getGraphArtworksByTokenIdsWithBids({
  tokenIds,
  first = 100,
}: GetGraphArtworksByTokenIdsArgs): Promise<ArtworksData> {
  const client = fndGraphClient();
  return await client.request<ArtworksData, GetGraphArtworksByTokenIdsArgs>(
    GET_ARTWORKS_BY_TOKEN_IDS_INCLUDING_BIDS,
    { tokenIds: rejectNils(tokenIds), first }
  );
}

export async function getGraphArtworksByPublicKeys({
  publicKeys,
  first = 100,
}: GetGraphArtworksByPublicKeysArgs): Promise<ArtworksData> {
  const client = fndGraphClient();
  return await client.request<ArtworksData, GetGraphArtworksByPublicKeysArgs>(
    GET_ARTWORKS_BY_PUBLIC_KEYS,
    {
      publicKeys: rejectNils(publicKeys.map((pk) => maybeLowerCase(pk))),
      first,
    }
  );
}

export async function getBatchedServerArtworks(
  artworks: Artwork[]
): Promise<Artwork[]> {
  const artworkIds = getArtworkIds(artworks);
  const query = await getHasuraArtworks({
    tokenIds: artworkIds,
    excludeHidden: true,
  });
  return query.artworks;
}

export async function getArtworksByTokenIds({
  tokenIds,
  excludeHidden = true,
}: HasuraArtworksQueryArgs): Promise<Artwork[]> {
  const [graphQuery, serverQuery] = await Promise.all([
    getGraphArtworksByTokenIds({ tokenIds, first: 200 }),
    getHasuraArtworks({
      tokenIds,
      excludeHidden,
    }),
  ]);

  const mergedArtworks = mergeGraphArtworksIfInDB({
    graphArtworks: graphQuery.artworks,
    serverArtworks: serverQuery.artworks,
  });

  return mergedArtworks;
}

export async function getArtworksByTokenIdsWithBids({
  tokenIds,
  excludeHidden = true,
}: HasuraArtworksQueryArgs): Promise<Artwork[]> {
  const [graphQuery, serverQuery] = await Promise.all([
    getGraphArtworksByTokenIdsWithBids({ tokenIds, first: 200 }),
    getHasuraArtworks({
      tokenIds,
      excludeHidden,
    }),
  ]);

  const mergedArtworks = mergeGraphArtworksIfInDB({
    graphArtworks: graphQuery.artworks,
    serverArtworks: serverQuery.artworks,
  });

  return mergedArtworks;
}

export async function getGraphAndServerArtworkByPublicKeys({
  publicKeys,
  excludeHidden = true,
}: HasuraArtworksByPublicKeysQueryArgs): Promise<Artwork[]> {
  const [serverArtworks, graphArtworks] = await Promise.all([
    getHasuraArtworksByPublicKeys({ publicKeys, excludeHidden }),
    getGraphArtworksByPublicKeys({ publicKeys, first: 300 }),
  ]);

  if (!serverArtworks) {
    return null;
  }
  const mergedArtworks = mergeGraphArtworksIfInDB({
    graphArtworks: graphArtworks.artworks,
    serverArtworks: serverArtworks.artworks,
  });
  return mergedArtworks;
}

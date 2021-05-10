import { gql } from '@apollo/client';
import { fndGraphClient } from 'lib/clients/graphql';
import { head } from 'ramda';

import {
  NftFragment,
  NftPercentSplitFragment,
  NftWithBidsFragment,
} from 'queries/subgraph/fragments';

import Artwork from 'types/Artwork';
import PercentSplit from 'types/PercentSplit';

import { maybeToString } from 'utils/strings';

export const GET_ACCOUNT_ARTWORKS = gql`
  query getAccountArtworks($publicKey: String!) {
    artworks: nfts(
      where: {
        creator: $publicKey
        owner_not: "0x0000000000000000000000000000000000000000"
      }
    ) {
      ...NftFragment
    }
  }
  ${NftFragment}
`;

export const GET_ARTWORKS_BY_TOKEN_IDS = gql`
  query getArtworksByTokenIds($tokenIds: [BigInt!], $first: Int!) {
    artworks: nfts(
      first: $first
      where: {
        tokenId_in: $tokenIds
        owner_not: "0x0000000000000000000000000000000000000000"
      }
    ) {
      ...NftFragment
    }
  }
  ${NftFragment}
`;

export const GET_ARTWORKS_BY_TOKEN_IDS_INCLUDING_BIDS = gql`
  query getArtworksByTokenIdsIncludingBids($tokenIds: [BigInt!], $first: Int!) {
    artworks: nfts(
      first: $first
      where: {
        tokenId_in: $tokenIds
        owner_not: "0x0000000000000000000000000000000000000000"
      }
    ) {
      ...NftWithBidsFragment
    }
  }
  ${NftWithBidsFragment}
`;

export const GET_NFT_BY_TOKEN_ID = gql`
  query getArtworksByTokenId($tokenId: String!) {
    artworks: nfts(
      where: {
        tokenId: $tokenId
        owner_not: "0x0000000000000000000000000000000000000000"
      }
    ) {
      ...NftFragment
    }
  }
  ${NftFragment}
`;

export const GET_NFT_BY_TOKEN_ID_INCLUDING_BURNED = gql`
  query getArtworksByTokenId($tokenId: String!) {
    artworks: nfts(where: { tokenId: $tokenId }) {
      ...NftFragment
    }
  }
  ${NftFragment}
`;

export const GET_ARTWORKS_BY_PUBLIC_KEYS = gql`
  query getArtworksByPublicKeys($publicKeys: [String!], $first: Int!) {
    artworks: nfts(
      first: $first
      where: {
        creator_in: $publicKeys
        owner_not: "0x0000000000000000000000000000000000000000"
      }
    ) {
      ...NftWithBidsFragment
    }
  }
  ${NftWithBidsFragment}
`;

export async function getGraphArtworkByTokenId(
  tokenId: string
): Promise<Artwork> {
  const client = fndGraphClient();
  const { artworks } = await client.request<ArtworksData, ArtworksArgs>(
    GET_NFT_BY_TOKEN_ID,
    { tokenId }
  );
  return head(artworks);
}

interface ArtworksData {
  artworks: Artwork[];
}
interface ArtworksArgs {
  tokenId: string;
}

export const GET_NFT_PERCENT_SPLITS = gql`
  query getArtworkPercentSplits($tokenId: BigInt!) {
    artworks: nfts(where: { tokenId: $tokenId }) {
      ...NftPercentSplitFragment
    }
  }
  ${NftPercentSplitFragment}
`;

export async function getArtworkPercentSplits(
  tokenId: string
): Promise<PercentSplit> {
  const client = fndGraphClient();
  const { artworks } = await client.request<ArtworksData, ArtworksArgs>(
    GET_NFT_PERCENT_SPLITS,
    { tokenId: maybeToString(tokenId) }
  );
  const artwork = head(artworks);
  return artwork?.percentSplit;
}

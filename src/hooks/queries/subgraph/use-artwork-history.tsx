import { UseQueryResult, useQuery, UseQueryOptions } from 'react-query';
import { gql } from '@apollo/client';
import { ClientError } from 'graphql-request';

import { NftWithHistoryFragment } from 'queries/subgraph/fragments';

import { buildNFTSlug } from 'utils/artwork/artwork';
import { maybeLowerCase } from 'utils/case';
import { isAllTrue } from 'utils/helpers';

import { QueryCacheKey } from 'types/Queries';
import Artwork from 'types/Artwork';

import { fndGraphClient } from 'lib/clients/graphql';

const GET_GRAPH_ARTWORK_HISTORY = gql`
  query getArtworkHistory($addressPlusTokenId: String!) {
    nft(id: $addressPlusTokenId) {
      ...NftWithHistoryFragment
    }
  }
  ${NftWithHistoryFragment}
`;

async function getGraphArtworkHistory(tokenId: string): Promise<ArtworkData> {
  const addressPlusTokenId = buildNFTSlug(tokenId);
  const client = fndGraphClient();
  return await client.request<ArtworkData, { addressPlusTokenId: string }>(
    GET_GRAPH_ARTWORK_HISTORY,
    { addressPlusTokenId: maybeLowerCase(addressPlusTokenId) }
  );
}

export interface ArtworkData {
  nft: Artwork;
}

interface ArtworkArgs {
  tokenId: string;
}

interface ArtworkVariables
  extends UseQueryOptions<ArtworkData, ClientError, ArtworkData>,
    ArtworkArgs {}

// Look up via our subgraph
export default function useArtworkHistory({
  tokenId,
  enabled = true,
  refetchInterval,
  refetchOnWindowFocus = false,
}: ArtworkVariables): UseQueryResult<ArtworkData, ClientError> {
  return useQuery(
    [QueryCacheKey.ArtworkHistory, { tokenId }],
    () => getGraphArtworkHistory(tokenId),
    {
      enabled: isAllTrue([tokenId, enabled]),
      refetchInterval,
      refetchOnWindowFocus,
    }
  );
}

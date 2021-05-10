import { UseQueryResult, useQuery, UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import { getArtworkPercentSplits } from 'queries/subgraph/artworks';

import { isAllTrue } from 'utils/helpers';

import { QueryCacheKey } from 'types/Queries';
import PercentSplit from 'types/PercentSplit';

type ArtworkSplitsData = PercentSplit;

interface ArtworkSplitsArgs {
  tokenId: string;
}

interface ArtworkSplitsVariables
  extends UseQueryOptions<ArtworkSplitsData, ClientError, ArtworkSplitsData>,
    ArtworkSplitsArgs {}

// Look up via our subgraph
export default function useArtworkSplits({
  tokenId,
  enabled = true,
  refetchInterval,
  refetchOnWindowFocus = false,
}: ArtworkSplitsVariables): UseQueryResult<ArtworkSplitsData, ClientError> {
  return useQuery(
    [QueryCacheKey.ArtworkSplits, { tokenId }],
    () => getArtworkPercentSplits(tokenId),
    {
      enabled: isAllTrue([tokenId, enabled]),
      refetchInterval,
      refetchOnWindowFocus,
    }
  );
}

import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from 'react-query';
import { ClientError } from 'graphql-request';

import { getNextPageParam } from 'utils/artwork/artwork';

import { getTrendingCollectors } from 'queries/hasura/trending-collectors';

import { QueryCacheKey } from 'types/Queries';
import { TrendingCollector } from 'types/Trending';

interface TrendingCollectorsArgs
  extends UseInfiniteQueryOptions<
    TrendingCollector[],
    ClientError,
    TrendingCollector[]
  > {
  orderByField: string;
  limit?: number;
}

export default function useTrendingCollectors({
  orderByField,
  limit = 100,
  enabled = true,
  refetchOnWindowFocus = false,
}: TrendingCollectorsArgs): UseInfiniteQueryResult<
  TrendingCollector[],
  ClientError
> {
  return useInfiniteQuery(
    [QueryCacheKey.TrendingCollectors, { orderByField }],
    ({ pageParam = 0 }) =>
      getTrendingCollectors({
        orderByField,
        limit,
        offset: limit * pageParam,
      }),
    {
      enabled: Boolean(orderByField && enabled),
      getNextPageParam,
      refetchOnWindowFocus,
    }
  );
}

import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from 'react-query';
import { ClientError } from 'graphql-request';

import { getNextPageParam } from 'utils/artwork/artwork';

import { getTrendingCreators } from 'queries/hasura/trending-creators';

import { QueryCacheKey } from 'types/Queries';
import { TrendingCreator } from 'types/Trending';

interface TrendingCreatorsArgs
  extends UseInfiniteQueryOptions<
    TrendingCreator[],
    ClientError,
    TrendingCreator[]
  > {
  orderByField: string;
  limit?: number;
}

export default function useTrendingCreators({
  orderByField,
  limit = 100,
  enabled = true,
  refetchOnWindowFocus = false,
}: TrendingCreatorsArgs): UseInfiniteQueryResult<
  TrendingCreator[],
  ClientError
> {
  return useInfiniteQuery(
    [QueryCacheKey.TrendingCreators, { orderByField }],
    ({ pageParam = 0 }) =>
      getTrendingCreators({
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

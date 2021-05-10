import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from 'react-query';
import { ClientError } from 'graphql-request';

import { QueryCacheKey } from 'types/Queries';

import { isAllTrue } from 'utils/helpers';
import { getNextPageParam } from 'utils/artwork/artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

import { getProfileCollectors } from 'queries/hasura/collectors';
import { Collector } from 'types/Account';
import { maybeGetAddressOrEmpty } from 'utils/users';

interface ProfileCollectorsVariables
  extends UseInfiniteQueryOptions<Collector[], ClientError, Collector[]> {
  publicKey: string;
  currentUserPublicKey: string;
  limit?: number;
}

export default function useProfileCollectors({
  publicKey,
  currentUserPublicKey,
  limit,
  refetchOnWindowFocus = false,
  enabled = true,
  initialData,
}: ProfileCollectorsVariables): UseInfiniteQueryResult<
  Collector[],
  ClientError
> {
  return useInfiniteQuery(
    [QueryCacheKey.ProfileCollectors, { publicKey, currentUserPublicKey }],
    ({ pageParam = 0 }) => {
      const perPageCount = limit || PUBLIC_FEED_PER_PAGE_COUNT;
      return getProfileCollectors({
        publicKey,
        currentUserPublicKey,
        limit: perPageCount,
        offset: perPageCount * pageParam,
      });
    },
    {
      refetchOnWindowFocus,
      getNextPageParam,
      enabled: isAllTrue([publicKey, enabled]),
      initialData,
      keepPreviousData: true,
    }
  );
}

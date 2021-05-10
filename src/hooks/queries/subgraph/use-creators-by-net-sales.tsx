import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from 'react-query';
import { ClientError } from 'graphql-request';

import { maybeGetAddressOrEmpty } from 'utils/users';
import { getNextPageParam } from 'utils/artwork/artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

import { getMergedCreatorsByNetSales } from 'queries/creators';
import { AccountFeed } from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

const PER_PAGE_COUNT = PUBLIC_FEED_PER_PAGE_COUNT;

export interface CreatorsByNetSalesVariables
  extends UseInfiniteQueryOptions<AccountFeed[], ClientError, AccountFeed[]> {
  publicKey: string;
}

export default function useCreatorsByNetSales({
  publicKey,
  refetchOnWindowFocus = false,
}: CreatorsByNetSalesVariables): UseInfiniteQueryResult<
  AccountFeed[],
  ClientError
> {
  const publicAddress = maybeGetAddressOrEmpty(publicKey);

  return useInfiniteQuery(
    [QueryCacheKey.CreatorsByNetSales, { publicAddress }],
    ({ pageParam = 0 }) => {
      return getMergedCreatorsByNetSales({
        first: PER_PAGE_COUNT,
        skip: PER_PAGE_COUNT * pageParam,
        publicKey: publicAddress,
      });
    },
    {
      refetchOnWindowFocus,
      getNextPageParam,
    }
  );
}

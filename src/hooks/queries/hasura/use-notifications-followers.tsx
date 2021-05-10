import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from 'react-query';
import { ClientError } from 'graphql-request';

import { maybeGetAddressOrEmpty } from 'utils/users';
import { QueryCacheKey } from 'types/Queries';
import { NotificationsFollowsResponse } from 'types/Notification';
import { getNotificationsFollows } from 'queries/hasura/notifications';
import { getNextPageParam } from 'utils/artwork/artwork';

interface RecentFollowsArgs
  extends UseInfiniteQueryOptions<
    NotificationsFollowsResponse,
    ClientError,
    NotificationsFollowsResponse
  > {
  publicKey: string;
  perPage: number;
}

export default function useNotificationsFollows({
  publicKey,
  perPage,
  refetchOnWindowFocus = false,
  enabled = true,
}: RecentFollowsArgs): UseInfiniteQueryResult<
  NotificationsFollowsResponse,
  ClientError
> {
  const publicAddress = maybeGetAddressOrEmpty(publicKey);

  return useInfiniteQuery(
    [QueryCacheKey.NotificationsFollows, { publicAddress }],
    ({ pageParam = 0 }) => {
      return getNotificationsFollows({
        publicKey: publicAddress,
        limit: perPage,
        offset: perPage * pageParam,
      });
    },
    {
      refetchOnWindowFocus,
      getNextPageParam: getNextPageParam,
      enabled: Boolean(publicAddress) && enabled,
    }
  );
}

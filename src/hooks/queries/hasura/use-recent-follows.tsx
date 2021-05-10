import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { ClientError } from 'graphql-request';

import { maybeGetAddressOrEmpty } from 'utils/users';
import { QueryCacheKey } from 'types/Queries';
import { NotificationsFollowsResponse } from 'types/Notification';
import { getNotificationsFollows } from 'queries/hasura/notifications';

interface RecentFollowsArgs
  extends UseQueryOptions<
    NotificationsFollowsResponse,
    ClientError,
    NotificationsFollowsResponse
  > {
  publicKey: string;
}

export default function useRecentFollows({
  publicKey,
  refetchOnWindowFocus = false,
}: RecentFollowsArgs): UseQueryResult<
  NotificationsFollowsResponse,
  ClientError
> {
  const publicAddress = maybeGetAddressOrEmpty(publicKey);

  return useQuery(
    [QueryCacheKey.RecentFollows, { publicAddress }],
    () => {
      return getNotificationsFollows({
        publicKey: publicAddress,
        limit: 5,
        offset: 0,
      });
    },
    {
      refetchOnWindowFocus,
    }
  );
}

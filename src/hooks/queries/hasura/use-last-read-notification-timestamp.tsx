import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { ClientError } from 'graphql-request';

import { maybeGetAddressOrEmpty } from 'utils/users';
import { QueryCacheKey } from 'types/Queries';
import { LastReadNotificationTimestampResponse } from 'types/Notification';
import { getLastReadNotificationTimestamp } from 'queries/hasura/notifications';

interface LastReadNotificationsTimestampArgs
  extends UseQueryOptions<
    LastReadNotificationTimestampResponse,
    ClientError,
    LastReadNotificationTimestampResponse
  > {
  publicKey: string;
}

export default function useLastReadNotificationsTimestamp({
  publicKey,
  refetchOnWindowFocus = false,
}: LastReadNotificationsTimestampArgs): UseQueryResult<
  LastReadNotificationTimestampResponse,
  ClientError
> {
  const publicAddress = maybeGetAddressOrEmpty(publicKey);

  return useQuery(
    [QueryCacheKey.LastReadNotificatonTimestamp, { publicAddress }],
    () => {
      return getLastReadNotificationTimestamp({
        publicKey: publicAddress,
      });
    },
    {
      refetchOnWindowFocus,
      enabled: Boolean(publicAddress),
    }
  );
}

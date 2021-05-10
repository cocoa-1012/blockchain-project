import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { ClientError } from 'graphql-request';

import { isAllTrue } from 'utils/helpers';
import { maybeGetAddressOrEmpty } from 'utils/users';
import { QueryCacheKey } from 'types/Queries';
import { NotificationsCountResponse } from 'types/Notification';
import { getNotificationsCount } from 'queries/hasura/notifications';

interface NotificationsCountArgs
  extends UseQueryOptions<
    NotificationsCountResponse,
    ClientError,
    NotificationsCountResponse
  > {
  publicKey: string;
  lastReadTimestamp: string;
}

export default function useNotificationsCount({
  publicKey,
  lastReadTimestamp,
  refetchOnWindowFocus = false,
  enabled = true,
  ...rest
}: NotificationsCountArgs): UseQueryResult<
  NotificationsCountResponse,
  ClientError
> {
  const publicAddress = maybeGetAddressOrEmpty(publicKey);

  return useQuery(
    [QueryCacheKey.NotificationsCount, { publicAddress, lastReadTimestamp }],
    () => {
      return getNotificationsCount({
        publicKey: publicAddress,
        lastReadTimestamp,
      });
    },
    {
      refetchOnWindowFocus,
      enabled: isAllTrue([enabled, publicKey]),
      ...rest,
    }
  );
}

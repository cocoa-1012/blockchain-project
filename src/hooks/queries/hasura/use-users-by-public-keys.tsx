import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import { getHasuraUsers } from 'queries/hasura/users';

import { notEmptyOrNil } from 'utils/helpers';

import Account from 'types/Account';
import ModerationStatus from 'types/ModerationStatus';

import { QueryCacheKey } from 'types/Queries';

interface UsersByPublicKeysData {
  users: Account[];
}

interface UsersByPublicKeysVariables
  extends UseQueryOptions<
    UsersByPublicKeysData,
    ClientError,
    UsersByPublicKeysData
  > {
  publicKeys: string[];
  moderationStatuses?: ModerationStatus[];
}

export default function useUsersByPublicKeys({
  publicKeys,
  moderationStatuses = [ModerationStatus.Active],
  refetchOnWindowFocus = false,
  enabled = true,
  ...rest
}: UsersByPublicKeysVariables): UseQueryResult<
  UsersByPublicKeysData,
  ClientError
> {
  return useQuery(
    [QueryCacheKey.UsersByPublicKeys, { publicKeys }],
    () => getHasuraUsers({ publicKeys, moderationStatuses }),
    {
      enabled: notEmptyOrNil(publicKeys) && enabled,
      refetchOnWindowFocus,
      ...rest,
    }
  );
}

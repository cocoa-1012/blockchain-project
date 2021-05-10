import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import { getUserOneTimeActions } from 'queries/oneTimeActions';

import { ActionType } from 'types/ActionType';

interface UserOneTimeActions {
  oneTimeActions: { createdAt: string }[];
}

interface UserOneTimeActionsArgs
  extends UseQueryOptions<UserOneTimeActions, ClientError, UserOneTimeActions> {
  publicAddress: string;
  actionType: ActionType;
}

export default function useUserOneTimeActions({
  publicAddress,
  actionType,
}: UserOneTimeActionsArgs): UseQueryResult<UserOneTimeActions, ClientError> {
  return useQuery(
    ['getUserOneTimeActions', publicAddress, actionType],
    () => getUserOneTimeActions({ publicKey: publicAddress, actionType }),
    { enabled: Boolean(publicAddress), refetchOnWindowFocus: false }
  );
}

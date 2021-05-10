import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import * as Sentry from '@sentry/react';
import { ClientError } from 'graphql-request';

import { upsertUser, UpsertUserVariables } from 'queries/users';
import { useExternalWalletLogout } from 'utils/auth';
import { getError } from 'utils/helpers';

import { QueryCacheKey } from 'types/Queries';
import Account from 'types/Account';

interface UpsertUserData {
  upsertUser: Account;
}

export default function useUpsertUser(
  publicKey: string
): UseMutationResult<UpsertUserData, ClientError, UpsertUserVariables> {
  const handleLogout = useExternalWalletLogout();

  const queryClient = useQueryClient();

  return useMutation(upsertUser, {
    onSuccess: (data) => {
      queryClient.setQueryData([QueryCacheKey.User, publicKey], {
        user: data?.upsertUser,
      });
    },
    onError: async (error) => {
      await handleLogout();
      Sentry.captureException(getError(error));
    },
  });
}

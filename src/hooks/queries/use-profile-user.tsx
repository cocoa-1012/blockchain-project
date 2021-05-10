import { ClientError } from 'graphql-request';
import { useQuery, UseQueryOptions } from 'react-query';

import { getUserForProfile, UserForProfile } from 'queries/hasura/users';

import { QueryCacheKey } from 'types/Queries';

interface UseProfileUserArgs {
  usernameOrPublicKey: string;
}

export default function useProfileUser(
  variables: UseProfileUserArgs,
  options?: UseQueryOptions<UserForProfile, ClientError>
) {
  return useQuery(
    [QueryCacheKey.UserProfile, variables],
    () => getUserForProfile(variables.usernameOrPublicKey),
    options
  );
}

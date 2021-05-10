/* eslint-disable max-lines */
import { fndGraphClient } from 'lib/clients/graphql';
import { stringify } from 'query-string';

import { getCreatorIds, sortUsersByPublicKeys } from 'utils/users';

import { AccountFeed } from 'types/Account';

import { getHasuraFeedUsers } from './hasura/users';
import { GET_CREATORS_BY_NET_SALES } from './subgraph/creators';

export const checkUsernameUniqueness = ({ username, excludedValue }) => {
  return fetch(`/api/username?${stringify({ username, excludedValue })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

interface CreatorsByNetSalesArgs {
  first: number;
  skip: number;
  publicKey: string;
}

export interface CreatorsByNetSales {
  creators: AccountFeed[];
}

export async function getMergedCreatorsByNetSales({
  first,
  skip,
  publicKey,
}: CreatorsByNetSalesArgs): Promise<AccountFeed[]> {
  const client = fndGraphClient();

  const creatorsBySalesQuery = await client.request<CreatorsByNetSales>(
    GET_CREATORS_BY_NET_SALES,
    { first, skip }
  );

  const creatorIds = getCreatorIds(creatorsBySalesQuery.creators);

  const hasuraUsersQuery = await getHasuraFeedUsers({
    userIds: creatorIds,
    publicKey,
  });

  const sortedHasuraUsers: AccountFeed[] = sortUsersByPublicKeys(
    creatorIds,
    hasuraUsersQuery.users
  );

  return sortedHasuraUsers;
}

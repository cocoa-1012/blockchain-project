import { UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';
import { pathOr, curry, compose, map, path, sum } from 'ramda';

import {
  useUserArtworksCounts as useUserArtworksCountsBase,
  UserArtworksCounts,
  UserArtworksCountsVariables,
} from 'graphql/hasura/queries/user-artworks-counts.generated';

export interface UserArtworksCountsComputed {
  artworksCreated: number;
  artworksCollected: number;
  artworksSplits: number;
  artworksHidden: number;
}

const getAggregateCount = curry((data: UserArtworksCounts, path: string) =>
  pathOr(0, [path, 'aggregate', 'count'], data)
);

const getArtworksCount = path<number>([
  'artworks_aggregate',
  'aggregate',
  'count',
]);

const getSplitsCount = curry((data: UserArtworksCounts, pathName: string) =>
  compose(
    // sum the total
    sum,
    // get the count from each value
    map(getArtworksCount),
    // get the split recipients array
    pathOr([], [pathName, 'splitRecipients'])
  )(data)
);

export const calculateArtworkCounts = (
  data: UserArtworksCounts
): UserArtworksCountsComputed => {
  const countOf = getAggregateCount(data);
  const sumTotal = getSplitsCount(data);

  const collectedHidden = countOf('artworksCollectedHidden');
  const createdHidden = countOf('artworksCreatedHidden');
  const splitsHidden = sumTotal('userSplitsHidden');

  return {
    artworksCollected: countOf('artworksCollected') - collectedHidden,
    artworksCreated: countOf('artworksCreated') - createdHidden,
    artworksSplits: sumTotal('userSplits') - splitsHidden,
    artworksHidden: countOf('artworksHidden'),
  };
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserArtworksCounts(
  variables: UserArtworksCountsVariables,
  options?: UseQueryOptions<
    UserArtworksCounts,
    ClientError,
    UserArtworksCountsComputed
  >
) {
  return useUserArtworksCountsBase(variables, {
    ...options,
    select: calculateArtworkCounts,
  });
}

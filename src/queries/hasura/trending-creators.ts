import { gql } from '@apollo/client';
import { fndHasuraClient } from 'lib/clients/graphql';
import { TrendingCreator } from 'types/Trending';
import { HasuraUserFragmentLight } from './hasura-fragments';

interface GetTrendingCreatorsArgs {
  orderByField: string;
  limit: number;
  offset: number;
}

const TRENDING_CREATORS_QUERY = gql`
  query trendingCreatorsQuery(
    $orderBy: trending_creator_order_by!
    $offset: Int!
    $limit: Int!
  ) {
    trendingCreators: trending_creator(
      order_by: [$orderBy]
      offset: $offset
      limit: $limit
    ) {
      oneDayVol
      oneDayNumSold
      oneDayCollectors
      oneDayPrimaryVol
      oneDaySecondaryVol

      oneWeekVol
      oneWeekNumSold
      oneWeekCollectors
      oneWeekPrimaryVol
      oneWeekSecondaryVol

      oneMonthVol
      oneMonthNumSold
      oneMonthCollectors
      oneMonthPrimaryVol
      oneMonthSecondaryVol

      totalVol
      totalNumSold
      totalCollectors
      totalPrimaryVol
      totalSecondaryVol

      user {
        ...HasuraUserFragmentLight
      }
    }
  }

  ${HasuraUserFragmentLight}
`;

export async function getTrendingCreators({
  orderByField,
  limit,
  offset,
}: GetTrendingCreatorsArgs): Promise<TrendingCreator[]> {
  const client = fndHasuraClient();

  const { trendingCreators } = await client.request<{
    trendingCreators: TrendingCreator[];
  }>(TRENDING_CREATORS_QUERY, {
    orderBy: { [orderByField]: 'desc' },
    limit,
    offset,
  });

  return trendingCreators;
}

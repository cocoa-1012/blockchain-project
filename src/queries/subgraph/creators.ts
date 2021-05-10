import { gql } from '@apollo/client';
import { fndGraphClient } from 'lib/clients/graphql';
import Account from 'types/Account';

export const GET_CREATOR = gql`
  query getCreator($publicKey: String!) {
    creator(id: $publicKey) {
      netSalesInETH
      netRevenueInETH
      netSalesPendingInETH
      netRevenuePendingInETH
    }
  }
`;

export const GET_CREATORS_BY_NET_SALES = gql`
  query getCreatorsByNetSales($skip: Int, $first: Int) {
    creators(
      orderBy: netRevenueInETH
      orderDirection: desc
      skip: $skip
      first: $first
    ) {
      id
      netSalesInETH
    }
  }
`;

interface CreatorsByNetSales {
  creators: Account[];
}

interface CreatorsByNetSalesArgs {
  first: number;
  skip: number;
}

export async function getCreatorsByNetSales({
  skip,
  first,
}: CreatorsByNetSalesArgs): Promise<CreatorsByNetSales> {
  const client = fndGraphClient();
  return await client.request<CreatorsByNetSales>(GET_CREATORS_BY_NET_SALES, {
    first,
    skip,
  });
}

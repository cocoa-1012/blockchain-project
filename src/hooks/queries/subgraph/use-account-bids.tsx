import { useQuery, QueryResult } from '@apollo/client';
import { NftMarketAuction } from '@f8n/f8n-contracts/src/types/generated/subgraph';

import { GET_ACCOUNT_BIDS } from 'queries/bids';

import Bid from 'types/Bid';

import { maybeLowerCase } from 'utils/case';

interface AccountBidsData {
  placedBids: Bid[];
  receivedBids: { nftMarketAuctions: NftMarketAuction[] };
}

interface AccountBidsArgs {
  publicKey: string;
}

export default function useAccountBids(
  publicAddress: string
): QueryResult<AccountBidsData> {
  return useQuery<AccountBidsData, AccountBidsArgs>(GET_ACCOUNT_BIDS, {
    variables: { publicKey: maybeLowerCase(publicAddress) },
    skip: !publicAddress,
    context: { endpoint: 'subgraph' },
  });
}

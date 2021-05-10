import { NftMarketAuction as Auction } from '@f8n/f8n-contracts/src/types/generated/subgraph';

export default Auction;

export type HighestBidAuction = {
  endsAt: string;
};

export enum AuctionStatus {
  OPEN = 'OPEN',
  CANCELED = 'CANCELED',
  FINALIZED = 'FINALIZED',
  ENDED = 'ENDED',
}

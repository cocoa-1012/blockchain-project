import { LatestArtworkEventFragment } from 'graphql/hasura/hasura-fragments.generated';
import Account from './Account';
import Artwork from './Artwork';

export enum EventType {
  /** The original mint event for this NFT */
  Minted = 'MINT',
  /** The NFT has been listed for sale */
  Listed = 'LIST',
  /** The NFT was unlisted from the market */
  Unlisted = 'UNLIST',
  /** The price for this listing has been modified */
  PriceChanged = 'PRICE_CHANGE',
  /** A bid for the NFT has been made */
  Bid = 'BID',
  /** The NFT has been sold */
  Sold = 'SELL',
  /** The sale has been settled on-chain and the NFT was transferred to the new owner */
  Settled = 'SETTLE',
  /** The NFT was transferred from one address to another */
  Transferred = 'TRANSFER',
  /** The NFT was burned and now no longer available on-chain */
  Burned = 'BURN',
  /** The creator has been migrated to a new account */
  CreatorMigrated = 'MIGRATE_CREATOR',
  /** The current owner of this NFT has migrated to a new account */
  OwnerMigrated = 'MIGRATE_OWNER',
  /** The seller for the current auction has migrated to a new account */
  SellerMigrated = 'MIGRATE_SELLER',
  /** The payment address for this NFT has migrated to a new address */
  CreatorPaymentAddressMigrated = 'MIGRATE_CREATOR_PAYMENT_ADDRESS',
}

export type LatestArtworkEvent = LatestArtworkEventFragment['latestEvents'][0];

export interface ArtworkEvent {
  publicKey: string;
  eventType: EventType;
  data: { amountInETH: string };
  tokenId: string;
  tokenCreator: string;
  blockTimestamp: string;
  user: Account;
}

export type ArtworkEventFromDB = ArtworkEvent & { artwork: Artwork };

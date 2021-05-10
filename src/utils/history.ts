import {
  compose,
  paths,
  reject,
  uniqBy,
  isNil,
  identity,
  map,
  flatten,
  propOr,
  head,
  when,
  prepend,
  any,
  equals,
} from 'ramda';

import Account from 'types/Account';
import NftHistory from 'types/NftHistory';
import Artwork from 'types/Artwork';
import Auction from 'types/Auction';
import { HistoricalEvent } from '@f8n/f8n-contracts/src/types/generated/subgraph';

import { findUserByPublicKey, maybeGetAddress } from './users';
import { isAuctionEnded, isAuctionLive } from './auctions/auctions';
import { isAllTrue } from './helpers';
import { EventType } from 'types/Event';

const MIGRATION_EVENTS = [
  HistoricalEvent.CreatorMigrated,
  HistoricalEvent.CreatorPaymentAddressMigrated,
  HistoricalEvent.OwnerMigrated,
  HistoricalEvent.SellerMigrated,
];

export const isBidEventAfterAuctionClose = (
  nftHistories: NftHistory[],
  mostRecentActiveAuction: Auction
): boolean => {
  // get the first history event
  const latestEvent = head(nftHistories);
  // is the history event a bid
  const isBidEvent = latestEvent?.event === HistoricalEvent.Bid;
  // if the auction has ended
  const hasAuctionEnded = isAuctionEnded(mostRecentActiveAuction?.dateEnding);
  // return true when all values are true
  return isAllTrue([isBidEvent, hasAuctionEnded]);
};

export const isBidEventAfterAuctionCloseV2 = (
  eventType: EventType,
  unixDateEnding: string
): boolean => {
  // is the history event a bid
  const isBidEvent = eventType === EventType.Bid;
  // if the auction has ended
  const hasAuctionEnded = !isAuctionLive(unixDateEnding);
  // return true when all values are true

  return isAllTrue([isBidEvent, hasAuctionEnded]);
};

const prependSoldState = (
  nftHistories: NftHistory[],
  mostRecentActiveAuction: Auction
) => {
  // get the first history event
  const firstEvent = head(nftHistories);
  // duplicate the event but change the status to sold
  const soldEvent: NftHistory = {
    ...firstEvent,
    event: HistoricalEvent.Sold,
    date: mostRecentActiveAuction?.dateEnding,
  };
  // prepend it to the start of the list
  return prepend(soldEvent, nftHistories);
};

export const getArtworkHistory = (artwork: Artwork): NftHistory[] => {
  // get the nftHistory prop — falling back to an array
  const nftHistory = propOr<[], Artwork, NftHistory[]>(
    [],
    'nftHistory',
    artwork
  );

  const mostRecentActiveAuction = artwork?.mostRecentActiveAuction;

  const isAuctionEndedAndUnsettled = isBidEventAfterAuctionClose(
    // pass in the latest nft history item
    nftHistory,
    // pass in the most recent auction
    mostRecentActiveAuction
  );

  return when(
    () => isAuctionEndedAndUnsettled,
    // if true then prepend the new sold state vent
    (nftHistory) => prependSoldState(nftHistory, mostRecentActiveAuction),
    // otherwise return the unmodified nft history
    nftHistory
  );
};

// an array of the paths where public keys exist on NftHistory
const getHistoryPublicKeyPaths = paths<string>([
  ['actorAccount', 'id'],
  ['nftRecipient', 'id'],
]);

export const getHistoryPublicKeys = compose(
  reject(isNil),
  // make sure only unique values
  uniqBy(identity),
  //  checksum each addresss
  map(maybeGetAddress),
  // flatten the arrays of arrays
  flatten,
  // map over the histories and get the keys
  map(getHistoryPublicKeyPaths)
);

export const findArtworkHistoryUsers = (
  historyItem: NftHistory,
  users: Account[]
): Account[] => {
  const usersPublicKeys = getHistoryPublicKeyPaths(historyItem);

  // map over the keys and match them to users using findUserByPublicKey
  const matchedUsers = map((publicKey) => {
    // find the user by their publicKey
    const matchedUser = findUserByPublicKey(publicKey, users);
    // when a user isn’t matched, return just their publicKey
    return matchedUser || { publicKey };
  }, usersPublicKeys);

  return matchedUsers;
};

export const filterMigrationHistoryEvents = reject((h: NftHistory) =>
  any(equals(h.event), MIGRATION_EVENTS)
);

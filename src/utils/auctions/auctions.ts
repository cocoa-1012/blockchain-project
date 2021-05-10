import {
  propEq,
  find,
  compose,
  curry,
  anyPass,
  hasPath,
  prop,
  path,
  ifElse,
  multiply,
  is,
  always,
  add,
  pathSatisfies,
  isNil,
  propSatisfies,
  sort,
  descend,
  ascend,
  allPass,
  propOr,
  head,
} from 'ramda';

import { NftMarketAuctionStatus } from '@f8n/f8n-contracts/src/types/generated/subgraph';
import Auction from 'types/Auction';

import { notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import { isUnixDateInPast } from 'utils/dates/dates';
import { ceilWithDecimals } from 'utils/formatters';
import Artwork, { ArtworkV2, BasicArtwork } from 'types/Artwork';
import {
  AuctionFragment,
  LatestArtworkEventFragment,
} from 'graphql/hasura/hasura-fragments.generated';
import { LatestArtworkEvent } from 'types/Event';

// convert each value prop to a number (for sorting)
const dateCreatedToNumber = compose<Auction, string, number>(
  Number,
  prop('dateCreated')
);

export const sortAuctionsByDateDesc = sort<Auction>(
  descend(dateCreatedToNumber)
);

export const sortAuctionsByDateAsc = sort<Auction>(ascend(dateCreatedToNumber));

export const isAuctionStatusOpen = propEq<string>(
  'status',
  NftMarketAuctionStatus.Open
);

export const isAuctionStatusFinalized = propEq<string>(
  'status',
  NftMarketAuctionStatus.Finalized
);

export const isAuctionStatusCanceled = propEq<string>(
  'status',
  NftMarketAuctionStatus.Canceled
);

export const isAuctionStatusOpenOrFinalized = anyPass([
  isAuctionStatusOpen,
  isAuctionStatusFinalized,
]);

// auction finder helper functions
export const findOpenAuction = find<Auction>(isAuctionStatusOpen);
export const findFinalizedAuction = find<Auction>(isAuctionStatusFinalized);
export const findOpenOrFinalizedAuction = find<Auction>(
  isAuctionStatusOpenOrFinalized
);

export const getFirstAuction = compose<Auction[], Auction[], Auction>(
  findOpenOrFinalizedAuction,
  sortAuctionsByDateAsc
);

export const getAuctionState = curry(
  (finderFn: (arg0: Auction[]) => Auction, data: Auction[]) =>
    compose(notEmptyOrNil, finderFn)(data)
);

// auction state helper functions
export const isAuctionOpen = getAuctionState(findOpenAuction);
export const isAuction = getAuctionState(findOpenAuction);

export const getAuctionMinBidPrice = ifElse(
  hasPath(['highestBid', 'amountInETH']),
  // TODO: Don't hardcode 1.1
  compose<Auction, string, number, number, number>(
    ceilWithDecimals(4),
    multiply(1.1),
    Number,
    path(['highestBid', 'amountInETH'])
  ),
  prop('reservePriceInETH')
);

const isString = is(String);
const isNumber = is(Number);

const isStringOrNumber = anyPass([isString, isNumber]);

// buffer in seconds
const PAST_CONFIRMATIONS_BUFFER = 30;

const isAuctionInPastWithBuffer = compose(
  isUnixDateInPast,
  add(PAST_CONFIRMATIONS_BUFFER),
  Number
);

export const isAuctionEnded = ifElse(
  // if the value is present
  isStringOrNumber,
  // run the value through the check
  isAuctionInPastWithBuffer,
  // otherwise return false
  always(false)
);

export const isDateInPast = ifElse(
  isStringOrNumber,
  isUnixDateInPast,
  always(false)
);

export const auctionHasNoBid = pathSatisfies(isNil, [
  'mostRecentActiveAuction',
  'highestBid',
]);

export const auctionHasHighestBid = propSatisfies(notEmptyOrNil, 'highestBid');

export const isArtworkAuctionWinner = curry(
  (publicAddress: string, auction: Auction) => {
    const highestBidder = auction?.highestBid?.bidder?.id;
    const isOwned = areKeysEqual([publicAddress, highestBidder]);
    return Boolean(isAuctionOpen && isOwned);
  }
);

export const isArtworkAuctionCreator = curry(
  (publicAddress: string, artwork: Artwork) => {
    const artworkOwnerId = artwork?.creator?.id;
    const isOwned = areKeysEqual([publicAddress, artworkOwnerId]);
    return Boolean(isAuctionOpen && isOwned);
  }
);

export const isArtworkAuctionOwner = curry(
  (publicAddress: string, auction: Auction) => {
    const artworkOwnerId = auction?.seller?.id;
    const isOwned = areKeysEqual([publicAddress, artworkOwnerId]);
    return Boolean(isAuctionOpen && isOwned);
  }
);

export const isAuctionActive = ifElse(
  propSatisfies(isNil, 'mostRecentActiveAuction'),
  always(false),
  compose(isAuctionStatusOpenOrFinalized, prop('mostRecentActiveAuction'))
);

export const isAuctionNotYetListed = anyPass([
  isNil,
  propEq('status', NftMarketAuctionStatus.Canceled),
]);

export const isAuctionLive = allPass([
  notEmptyOrNil,
  (date: string) => !isAuctionEnded(date),
]);

export const isAuctionOpenForBids = anyPass([
  // is the auction in action
  (auction: Auction) => isAuctionLive(auction?.dateEnding),
  // is the auction listed and ready
  allPass([
    notEmptyOrNil,
    isAuctionStatusOpen,
    (auction: Auction) => !auction?.highestBid,
  ]),
]);

export const isAuctionUnclaimed = allPass([
  notEmptyOrNil,
  isAuctionStatusOpen,
  (auction: Auction) => isAuctionEnded(auction?.dateEnding),
]);

export const getMostRecentAuction = compose<
  BasicArtwork,
  AuctionFragment[],
  AuctionFragment
>(head, propOr([], 'auctions'));

export const getLatestArtworkEvent = compose<
  BasicArtwork,
  LatestArtworkEventFragment['latestEvents'],
  LatestArtworkEvent
>(head, propOr([], 'latestEvents'));

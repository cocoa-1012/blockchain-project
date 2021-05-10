import {
  propEq,
  prop,
  compose,
  reject,
  allPass,
  path,
  propOr,
  map,
  uniq,
  curry,
  find,
  sort,
  descend,
  uniqBy,
} from 'ramda';
import { getAddress } from '@ethersproject/address';
import { NftMarketBidStatus } from '@f8n/f8n-contracts/src/types/generated/subgraph';

import { isAuctionEnded } from 'utils/auctions/auctions';
import { maybeLowerCase } from 'utils/case';

import Bid from 'types/Bid';
import { buildArtworkPath } from 'utils/artwork/artwork';
import Artwork from 'types/Artwork';
import Account from 'types/Account';

const isOutbid = propEq<string>('status', NftMarketBidStatus.Outbid);

// convert each value prop to a number (for sorting)
const valueToNumber = compose(Number, prop('amountInETH'));

// convert each value prop to a number (for sorting)
const dateToNumber = compose(Number, prop('datePlaced'));
const dateEndingToNumber = compose(Number, prop('dateEnding'));

export const sortBidsByValueDesc = sort(descend(valueToNumber));
export const sortBidsByDateDesc = sort(descend(dateToNumber));
export const sortBidsByEndingDateDesc = sort(descend(dateEndingToNumber));

const isBidAuctionEnded = compose(
  isAuctionEnded,
  path(['nftMarketAuction', 'dateEnding'])
);

// return true when status === Outbid and auction has ended
const isEndedAndOutbid = allPass([isBidAuctionEnded, isOutbid]);

// reject bids that match
export const rejectLostBids = reject<Bid, any>(isEndedAndOutbid);

export const getBidAmount = compose(Number, propOr(0, 'amountInETH'));
const getBidderId = compose(getAddress, path(['bidder', 'id']));

export const getBidderIds = compose<Bid[], string[], string[]>(
  uniq,
  map(getBidderId)
);

const hasMatchingBid = curry((publicAddress: string, bid: Bid): boolean => {
  return maybeLowerCase(bid.bidder.id) === maybeLowerCase(publicAddress);
});

export const getMyBid = curry(
  (publicAddress: string, bids: Bid[]): Bid => {
    const sortedBids = sortBidsByValueDesc(bids);
    return find(hasMatchingBid(publicAddress), sortedBids);
  }
);

export const getUniqueBids = compose<Bid[], Bid[], Bid[]>(
  uniqBy(path(['nftMarketAuction', 'id'])),
  sortBidsByValueDesc
);

export const getBidsForActivity = compose<Bid[], Bid[], Bid[], Bid[]>(
  sortBidsByDateDesc,
  getUniqueBids,
  rejectLostBids
);

interface BuildBidPathProps {
  creator: Account;
  artwork: Artwork;
}

export function buildBidPath({ creator, artwork }: BuildBidPathProps): string {
  const basePath = buildArtworkPath({ user: creator, artwork });
  return `${basePath}/bid`;
}

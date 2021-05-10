/* eslint-disable max-lines */
import {
  includes,
  last,
  split,
  head,
  equals,
  compose,
  path,
  test,
  is,
  ifElse,
  allPass,
  when,
} from 'ramda';

import { maybeLowerCase } from 'utils/case';
import { notEmptyOrNil } from './helpers';

const isString = is(String);

export const getStrAfterLastHyphen = when(isString, compose(last, split('-')));

const containsHyphen = includes('-');

export const getTokenId = ifElse(
  allPass([notEmptyOrNil, isNFTProduct, containsHyphen]),
  getStrAfterLastHyphen,
  () => null
);
export const getStrAfterLastSlash = when(isString, compose(last, split('/')));

function hasZeroPrefix(str) {
  return head(str) === '0';
}

export function isNFTProduct(symbol: string): boolean {
  const hasDash = includes('-', symbol);

  if (hasDash) {
    // 'thing-1' becomes ['thing', '1']
    const splitString = split('-', symbol);
    // returns '1'
    const tokenIdString: string = last(splitString);
    // returns 1
    const tokenId = Number(tokenIdString);

    return is(Number, tokenId);
  }

  let nftLikelihoodScore = 0;

  const strAfterLastHyphen = getStrAfterLastHyphen(symbol);

  if (head(symbol) === '$') {
    nftLikelihoodScore--;
  }

  if (!hasZeroPrefix(strAfterLastHyphen)) {
    nftLikelihoodScore++;
  }

  if (symbol.length >= 11) {
    nftLikelihoodScore++;
  }

  return nftLikelihoodScore >= 2;
}

export const getIsHighestBid = ({
  publicKey,
  bid,
}: {
  publicKey: string;
  bid: any;
}): boolean =>
  compose(
    // does it equal our public key?
    // if so, it’s the highest bid
    equals(maybeLowerCase(publicKey)),
    // convert it to lower case
    maybeLowerCase,
    // get the top bid
    path(['nftBids', 0, 'buyer', 'id'])
  )(bid);

export const getNFTBidPrice = ({
  startPrice = '0',
  minBidPrice = '0',
} = {}): number => {
  const parsedStartPrice = parseFloat(startPrice);
  const parsedMinBidPrice = parseFloat(minBidPrice);

  return parsedMinBidPrice < parsedStartPrice
    ? parsedStartPrice
    : parsedMinBidPrice;
};

export const getProductStartPrice = (product) =>
  product?.totalBuyPrice ?? product?.startPrice ?? product?.startingPrice;

export const isValidUUID = test(
  /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/gm
);

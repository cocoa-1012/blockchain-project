import {
  map,
  compose,
  reverse,
  head,
  sortBy,
  identity,
  sum,
  not,
  includes,
  prop,
  when,
  any,
  propEq,
  values,
  anyPass,
} from 'ramda';

import { maybeParseFloat, notEmptyOrNil } from './helpers';

export const getMaxValue = compose<any[], number[], number[], number[], number>(
  // get the first value
  head,
  // reverse so it’s descending
  reverse,
  // sort by value ascending
  sortBy(identity),
  // parse each value
  map(maybeParseFloat)
);

export const sumValues = compose<any[], number[], number>(
  sum,
  // parse each value
  map(maybeParseFloat)
);

export const isNonUserRejectedError = when(
  notEmptyOrNil,
  compose(
    not,
    anyPass([
      // MetaMask Desktop
      includes('MetaMask Tx Signature: User denied transaction signature.'),
      // Rainbow WalletConnect
      includes('User rejected request'),
      // MetaMask WalletConnect
      includes('User rejected the transaction'),
    ]),
    prop('message')
  )
);

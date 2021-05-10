import {
  compose,
  take,
  when,
  is,
  split,
  last,
  head,
  includes,
  replace,
  startsWith,
  toString,
  propOr,
} from 'ramda';
import { notEmptyOrNil } from './helpers';

const appendEllipsis = (str) => `${str}…`;

const trimString = compose(appendEllipsis, take(180));

const isString = is(String);
const isNumber = is(Number);

export const maybeToString = when(isNumber, toString);

// get first 180 characters from bio
export const trimBio = when(isString, trimString);

const getPathFromUrl = when(
  // when it includes a query param
  includes('?'),
  // split by the question mark and take the first part
  compose(head, split('?'))
);

export const getSocialHandle = when(
  notEmptyOrNil,
  compose(
    // get last part
    last,
    // split by slash
    split('/'),
    // remove trailing slash
    replace(/\/$/, ''),
    // get rid of query params
    getPathFromUrl
  )
);

export const stripAtSymbol = when(startsWith('@'), replace('@', ''));

export const getInstagramHandle = compose(
  when(notEmptyOrNil, stripAtSymbol),
  getSocialHandle
);

export const propOrEmptyString = (propName: string) => propOr('', propName);

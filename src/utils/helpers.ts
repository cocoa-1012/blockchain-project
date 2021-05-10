/* eslint-disable max-lines */
import slugify from 'underscore.string/slugify';
import {
  complement,
  isEmpty,
  prop,
  when,
  anyPass,
  isNil,
  all,
  test,
  is,
  slice,
  curry,
  ifElse,
  compose,
  has,
  any,
  head,
  take,
  toLower,
  map,
  filter,
  propEq,
  length,
  gt,
  propSatisfies,
  last,
  reject,
  toString,
  cond,
  T,
} from 'ramda';
import { getAddress } from '@ethersproject/address';

import Account, { PolymorphicAccount } from 'types/Account';

//stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = (arr) =>
  [...arr].reduceRight(
    (res, _, __, s) => (
      res.push(s.splice(0 | (Math.random() * s.length), 1)[0]), res
    ),
    []
  );

// when an array or string isn’t empty
export const notEmpty = complement(isEmpty);

export const isEmptyOrNil = anyPass([isEmpty, isNil]);

export const notEmptyOrNil = complement(isEmptyOrNil);

export const maybeParseFloat = when(is(String), parseFloat);

export const allNotEmptyOrNil = all(notEmptyOrNil);
export const anyNotEmptyOrNil = any(notEmptyOrNil);

export const getFirstValue = when(is(Array), head);
export const getLastValue = when(is(Array), last);

function generateUID() {
  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  const firstPartReturn = ('000' + firstPart.toString(36)).slice(-3);
  const secondPartReturn = ('000' + secondPart.toString(36)).slice(-3);
  return firstPartReturn + secondPartReturn;
}

export const getFileInfo = (file) => {
  const filename = file.name;
  const ext = filename.split('.').pop();
  return {
    filename: `${slugify(filename)}-${generateUID()}.${ext}`,
    mimetype: file.type,
    type: 'PROFILE',
  };
};

export const isValidTxHash = test(/^0x([A-Fa-f0-9]{64})$/g);

export const isProdOrStaging = ['production', 'staging'].includes(
  process.env.NEXT_PUBLIC_APP_ENV
);

export const isProd = (): boolean => {
  const IS_PROD = 'production' === process.env.NEXT_PUBLIC_APP_ENV;
  return IS_PROD;
};

interface TruncateAddressArgs {
  address: string;
  numberOfChars: number;
}

export const truncateAddress = ({
  address,
  numberOfChars,
}: TruncateAddressArgs): string => truncateStringCenter(numberOfChars, address);

export const truncateStringCenter = curry(
  (count: number, string: string): string =>
    // defensively call the slice function only when it’s a string (vs. a null)
    when(
      is(String),
      // add two characters to the first part of the slice to cater for 0x
      (str) => `${slice(0, count + 2, str)}...${slice(-count, Infinity, str)}`,
      string
    )
);

const appendEllipsis = curry((count: number, string: string) =>
  compose<string, string, string>((str) => `${str}…`, take(count))(string)
);

export const maybeAddEllipsis = curry((count: number, string: any) =>
  when<string, string>(
    () => gt(length(string), count),
    appendEllipsis(count),
    string
  )
);

export const truncateString = curry((count: number, string: string) =>
  when(notEmptyOrNil, maybeAddEllipsis(count), string)
);

export const truncateMetaDescription = truncateString(160);

interface CategorizedModes {
  isBid: boolean;
  isAccept: boolean;
}

export function categorizeMode(mode: string): CategorizedModes {
  return {
    isBid: mode === 'bid',
    isAccept: mode === 'accept',
  };
}

export function padNumber(num: number, size = 5): string {
  return (Math.pow(10, size) + ~~num).toString().substring(1);
}

export const isETHAddress = test(/^0x[a-fA-F0-9]{40}$/g);

export const hasUsername = when(
  notEmptyOrNil,
  propSatisfies<boolean, Account>(notEmptyOrNil, 'username')
);

export const publicKeyOrIdOrAddress = cond([
  [has('publicKey'), prop('publicKey')],
  [has('publicAddress'), prop('publicAddress')],
  [T, prop('id')],
]);

export const getUsernameOrAddress = ifElse(
  hasUsername,
  compose((str: string) => `@${str}`, prop('username')),
  publicKeyOrIdOrAddress
);

const truncateWhenIsAddress = when<string, string>(
  isETHAddress,
  truncateStringCenter(4)
);

export const getUsernameOrTruncatedAddress = compose<
  PolymorphicAccount,
  string,
  string
>(truncateWhenIsAddress, getUsernameOrAddress);

export const getNameOrUsername = ifElse(
  propSatisfies(notEmptyOrNil, 'name'),
  prop('name'),
  prop('username')
);

interface UsernameInfo {
  usernameOrAddress: string;
  nameOrUsername: string;
  isAddress: boolean;
  hasName: boolean;
  hasUsername: boolean;
}

export function getBuyerUsernameOrAddressInfo(user: Account): UsernameInfo {
  const nameOrUsername = when(notEmptyOrNil, getNameOrUsername, user);
  return {
    nameOrUsername,
    usernameOrAddress: getUsernameOrTruncatedAddress(user),
    hasName: notEmptyOrNil(user?.name),
    hasUsername: notEmptyOrNil(user?.username),
    isAddress: isEmptyOrNil(nameOrUsername),
  };
}

export const mapStrToLower = map<string, string>(toLower);
export const mapStrToCheckSum = map<string, string>(getAddress);

export const getFeaturedArticles = compose(
  take(3),
  filter<any>(propEq('featured', true))
);

export const mapStrToNumber = map<string, number>(Number);
export const mapNumberToStr = map<number | string, string>(toString);

export const castTokenIds = compose<string[], string[], number[], number[]>(
  reject(isNaN),
  mapStrToNumber,
  reject(isEmptyOrNil)
);

type NumberOrString = number[] | string[];

export const castTokenIdsStr = compose<
  NumberOrString,
  NumberOrString,
  string[]
>(mapNumberToStr, reject(isEmptyOrNil));

export const rejectNils = reject(isEmptyOrNil);
export const rejectFalse = reject(complement(Boolean));

export const isAnyTrue = any(Boolean);
export const isAllTrue = all(Boolean);

export const noop = (): void => void 0;

export const getError = (error: any): Error => {
  // if it’s already an error type, return the error
  if (error instanceof Error) {
    return error;
  }

  // check if there’s a nested error and return that
  const nestedError = error.originalError || error.error;

  if (nestedError instanceof Error) {
    return nestedError;
  }

  // if the object has a message prop, build a new error
  if (error.message) {
    return new Error(error.message);
  }

  // otherwise return the object
  return error;
};

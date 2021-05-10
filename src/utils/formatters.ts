import {
  compose,
  is,
  when,
  allPass,
  includes,
  ifElse,
  curry,
  always,
  complement,
  equals,
  replace,
} from 'ramda';
import { isEmptyOrNil } from './helpers';

export const ceilWithDecimals = curry(
  (decimals: number, number: number): number => {
    return roundUp(number, decimals);
  }
);

const truncate = curry((precision: number, value: number): number => {
  const step = Math.pow(10, precision);
  const temp = Math.trunc(step * value);
  return temp / step;
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatCurrencyRaw = currencyFormatter.format;

export const formatCurrency = compose(formatCurrencyRaw, floorToTwoDecimals);

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatNumber = numberFormatter.format;

const integerFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ethFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 10,
});

const ethFormatterRounded = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const minimalFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatETH = ethFormatter.format;
export const formatETHRounded = ethFormatterRounded.format;
export const formatInteger = integerFormatter.format;

export const ceilETHWithSuffix = compose<
  number | string,
  number,
  string,
  string
>(
  (input) => input + ' ETH',
  formatETHRounded,
  // TODO: decide if we want to truncate to 2 decimals
  ceilWithDecimals(4)
);

const removeCommas = (val: string) => val.replace(/,/g, '');

const twoDecimals = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function floorToTwoDecimals(val: number): number {
  return _roundDown(val, 2);
}

const formatAndRemoveCommas = compose(removeCommas, twoDecimals.format);
const isStringWithPeriod = allPass([is(String), includes('.')]);

// Intl.NumberFormat adds commas to separate thousands

// so here we’re removing them after we format the number
export const withTwoDecimals = compose(
  formatAndRemoveCommas,
  floorToTwoDecimals
);

export const withCeilToTwoDecimals = compose(
  formatAndRemoveCommas,
  ceilToTwoDecimals
);

// Note: Don't use this function directly - perhaps you want
// withTwoDecimals
function _roundDown(number: number, decimals = 0) {
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// https://stackoverflow.com/a/21760326/1837427
export function roundUp(number: number, decimals = 0): number {
  return Math.ceil(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function ceilToTwoDecimals(val: number): number {
  return roundUp(val, 2);
}

export const isString = is(String);

export const parseFiat = when(isString, compose(parseFloat, removeCommas));

// returns true when `val !== 0`
const notEqualToZero = complement(equals(0));

// returns true when `val !== isNaN`
const notNaN = complement(isNaN);

export const isNonZeroNumber = compose<string, number, boolean>(
  // reurn true if all the conditions are met
  allPass([is(Number), notNaN, notEqualToZero]),
  Number
);

export const formatETHWithSuffix = compose<
  string | number,
  number,
  number,
  string,
  string,
  string
>(
  (val) => `${val} ETH`,
  // replace 0.00 with nicer formatted 0
  replace(/^0.00$/, '0'),
  formatETHRounded,
  ifElse(
    // if is number, not NaN + greater than zero
    isNonZeroNumber,
    // return the value as a number
    Number,
    // otherwise return zero
    always(0)
  ),
  // TODO: decide if we want to truncate to 2 decimals
  truncate(4)
);

export function countDecimals(value: number): number {
  const hasNoValue = isEmptyOrNil(value);
  if (hasNoValue) {
    return 0;
  }
  if (value % 1 != 0) {
    return value.toString().split('.')[1].length;
  }
  return 0;
}

/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import format from 'date-fns/fp/format';
import parseISO from 'date-fns/fp/parseISO';
import isBefore from 'date-fns/fp/isBefore';

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  parseJSON,
  getUnixTime,
} from 'date-fns/fp';

import {
  replace,
  complement,
  isNil,
  when,
  lte,
  prop,
  is,
  dropWhile,
  compose,
  curry,
  gt,
  ifElse,
  always,
  cond,
  gte,
  T,
  anyPass,
  lt,
  equals,
} from 'ramda';

import { CountdownPart } from 'hooks/use-countdown';

import { ArtworkAuctionBidActionProps } from 'components/artworks/auction/types';
import { isEmptyOrNil, notEmptyOrNil } from 'utils/helpers';

export const parseUnixString = compose<string, number, number>(
  // multiply by 1000 as timestamps come through in seconds
  (date) => date * 1000,
  Number
);
interface CalculateInitialDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateTimeDifferenceInParts = (
  endDate: string
): CalculateInitialDuration => {
  const nowUnix = Date.now();
  const futureDate = parseUnixString(endDate);

  const days = differenceInDays(nowUnix, futureDate);
  const hours = differenceInHours(nowUnix, futureDate) % 24;
  const minutes = differenceInMinutes(nowUnix, futureDate) % 60;
  const seconds = differenceInSeconds(nowUnix, futureDate) % 60;
  return { days, hours, minutes, seconds };
};

export const postedOn = compose(format('d MMMM yyyy'), parseISO);
export const lastUpdated = compose(format('MMMM d, yyyy'), parseISO);

export const formatOrderDateTimeUnix = compose(
  format('MMM d, h:mm a'),
  parseUnixString
);

// inverts the isNil check
const notNil = complement(isNil);

// Convert a string to a number, get a js date
// from unix time in seconds, then compare it with
// the current js date
export const isUnixDateInPast = (dateUnix: number): boolean => {
  const nowUnix = Date.now();
  const isBeforeNow = compose(isBefore(nowUnix), parseUnixString);

  const result = when(notNil, isBeforeNow, dateUnix);

  return result;
};

const isString = is(String);

export const formatBidDateShort = when(
  isString,
  compose(
    // remove periods in the a.m. and p.m. formatting
    replace(/[.]/g, ''),
    // Jan 22, 2021 at 2:41p.m.
    format(`MMM d, yyyy 'at' h:mmaaaa`),
    parseUnixString
  )
);

export const formatBidDate = when(
  isString,
  compose(
    // remove periods in the a.m. and p.m. formatting
    replace(/[.]/g, ''),
    // January 22, 2021 at 2:41p.m.
    format(`MMMM d, yyyy 'at' h:mmaaaa`),
    parseUnixString
  )
);

// when the 'value' prop is <= 0 return true
const isValueNotZero = (num: number) => lte(num, 0);

// drop values that equal 0 from start of array
export const getTimeDifferenceParts = dropWhile<CountdownPart>(
  compose<CountdownPart, number, boolean>(
    anyPass([isValueNotZero, isNaN, isEmptyOrNil]),
    prop('value')
  )
);

export const getMinutesRemaining = (timestamp: string): number =>
  ifElse(
    isString,
    compose(differenceInMinutes(Date.now()), parseUnixString),
    always(Infinity)
  )(timestamp);

export const whenMinsLessThan = curry(
  (minutes: number, data: ArtworkAuctionBidActionProps): boolean => {
    return compose(gt(minutes), prop('minutesRemaining'))(data);
  }
);

export const formatDateJoined = compose(format('MMMM yyyy'), parseJSON);

export function formatRelativeTimestamp(timestamp: string): string {
  const eventDate = new Date(`${timestamp}Z`);
  const now = new Date();
  const diffInSecs = differenceInSeconds(eventDate, now);

  return cond([
    // Less than or a minute
    [gte(60), always('1m')],
    // Less than 60 minutes
    [gt(3600), (seconds) => `${Math.floor(seconds / 60)}m`],
    // Less 24 hours
    [gt(86400), (seconds) => `${Math.floor(seconds / 60 / 60)}h`],
    // Older than 24 hours
    [T, () => format('MMM d')(eventDate)],
  ])(diffInSecs);
}

export const parseDateToUnix = when(
  notEmptyOrNil,
  compose<string, Date, number>(getUnixTime, parseJSON)
);

enum TimeUnit {
  // 1 year in mins
  year = 525600,
  // 1 month in mins
  month = 43800,
  // 1 day in mins
  day = 1440,
  // 1 hour in mins
  hour = 60,
  // otherwise format as mins
  minute = 1,
}

const pluralizeTimeAgo = curry((timeUnit: string, timeAgo: number, _) =>
  cond([
    [equals(1), (timeAgo) => `${timeAgo} ${timeUnit} ago`],
    [T, (timeAgo) => `${timeAgo} ${timeUnit}s ago`],
  ])(timeAgo)
);

const calculateTimeDifference = curry(
  (timeUnit: TimeUnit, diffInMins: number) => {
    const timeAgo = Math.round(diffInMins / timeUnit);

    return cond([
      [equals(TimeUnit.year), pluralizeTimeAgo('year', timeAgo)],
      [equals(TimeUnit.month), pluralizeTimeAgo('month', timeAgo)],
      [equals(TimeUnit.day), pluralizeTimeAgo('day', timeAgo)],
      [equals(TimeUnit.hour), pluralizeTimeAgo('hour', timeAgo)],
      [equals(TimeUnit.minute), pluralizeTimeAgo('minute', timeAgo)],
    ])(timeUnit);
  }
);

export function timeAgoInWords(timestamp: string): number {
  const unixDate = parseDateToUnix(timestamp);
  const minsAgo = differenceInMinutes(unixDate * 1000, Date.now());

  return cond([
    [lt(TimeUnit.year), calculateTimeDifference(TimeUnit.year)],
    [lt(TimeUnit.month), calculateTimeDifference(TimeUnit.month)],
    [lt(TimeUnit.day), calculateTimeDifference(TimeUnit.day)],
    [lt(TimeUnit.hour), calculateTimeDifference(TimeUnit.hour)],
    [T, calculateTimeDifference(TimeUnit.minute)],
  ])(minsAgo);
}

/* eslint-disable max-lines */
import {
  compose,
  curry,
  nth,
  unnest,
  repeat,
  prop,
  ifElse,
  all,
  map,
  equals,
  complement,
  isNil,
  always,
  find,
  propEq,
  propSatisfies,
  when,
  propOr,
  propIs,
  sort,
  indexOf,
  allPass,
  is,
  flatten,
  pathOr,
  uniqBy,
  countBy,
  length,
  identity,
  head,
} from 'ramda';
import { getAddress } from '@ethersproject/address';

import {
  getUsernameOrTruncatedAddress,
  isETHAddress,
  mapStrToCheckSum,
  notEmptyOrNil,
} from 'utils/helpers';
import { getSymbolFromCreator } from 'utils/creator';
import { maybeLowerCase } from 'utils/case';

import Account, { AccountFeed } from 'types/Account';
import WaitlistVote from 'types/WaitlistVote';

import { WaitlistUser } from 'types/Waitlist';
import { isFlaggedForModeration } from './moderation';

export const getUserFullName = when(notEmptyOrNil, prop('name'));

// https://stackoverflow.com/a/62837595/1837427
const getLastDigit = (num: number): number => +(num + '').slice(-1);

type AvatarGradient = [string, string];

export const gradients: AvatarGradient[] = [
  ['#54BCFB', '#4342F3'],
  ['#523FEF', '#FD22AD'],
  ['#FD22AD', '#ED5655'],
  ['#ED5356', '#F9D649'],
  ['#FFF61F', '#19FF3E'],
];

const getRepeatedGradients = compose<
  AvatarGradient[],
  AvatarGradient[][],
  AvatarGradient[]
>(unnest, (arr) => repeat(arr, 2));

export const repeatedGradients = getRepeatedGradients(gradients);

export const buildGradient = (from: string, to: string): string =>
  `linear-gradient(135deg, ${from}, ${to})`;

export const getAvatarFn = curry((gradients, number) => {
  const getIndex = ifElse(isNil, always(0), getLastDigit);
  const index = getIndex(number);
  const [gradientFrom, gradientTo] = nth(index, gradients);
  return buildGradient(gradientFrom, gradientTo);
});

export const getAvatarByIndex = getAvatarFn(repeatedGradients);

export const getProfilePageTitle = (user: Account): string => {
  const userFullName = getUserFullName(user);
  const hasFullName = notEmptyOrNil(userFullName);
  const username = `@${getSymbolFromCreator(user)}`;

  if (hasFullName) {
    return `${userFullName} (${username})`;
  } else {
    return getUsernameOrTruncatedAddress(user);
  }
};

export const getDisplayName = when(
  notEmptyOrNil,
  ifElse(
    propSatisfies(notEmptyOrNil, 'name'),
    prop('name'),
    getUsernameOrTruncatedAddress
  )
);

// TODO: build helper that reduces [name, username, publicKey]
// it should then truncate the publicKey (if it’s a key)

// invert of isNil
const notNil = complement(isNil);

// returns true if all in array are not nil
const allNotNil = all(notNil);

// returns true if all not nil and all not equal
const allEqual = (items: unknown[]): boolean => {
  return all(equals(head(items)), items);
};

// combination of allNotNil and bothNotEqual
export const areKeysEqual = compose<string[], string[], boolean>(
  allPass([allNotNil, allEqual]),
  map(maybeLowerCase)
);

export const findUserByPublicKey = curry((publicKey, users): Account => {
  return find<Account>(
    propEq<string>('publicKey', maybeGetAddress(publicKey)),
    users
  );
});

export const isApprovedCreator = propSatisfies<boolean, Account>(
  notEmptyOrNil,
  'isApprovedCreator'
);

export const isAccountApprovedCreator = (account: Account): boolean => {
  return !!account?.isApprovedCreator;
};

export const getCreatorIds = compose<Account[], string[], string[]>(
  mapStrToCheckSum,
  map(prop('id'))
);

export const getUsers = propOr<[]>([], 'users');

export const sortUsersByPublicKeys = curry((publicKeys, users) => {
  return sort((a: Account, b: Account) => {
    const firstIndex = indexOf(a.publicKey, publicKeys);
    const secondIndex = indexOf(b.publicKey, publicKeys);
    return firstIndex - secondIndex;
  }, users);
});

export const maybeGetAddress = when<string, string>(
  allPass([is(String), isETHAddress]),
  getAddress
);

export const mapGetAddress = map(maybeGetAddress);

export const maybeGetAddressOrEmpty = ifElse(
  allPass([is(String), isETHAddress]),
  getAddress,
  always('')
);

export const isOnWaitlist = when(
  notEmptyOrNil,
  propIs(String, 'joinedWaitlistAt')
);

// if there is no waitlist rank, make sure they appear last
export const getUserWaitlistRank = pathOr<number>(Infinity, [
  'waitlistInfo',
  'rankNumber',
]);

export const flattenAndSortWaitlist = compose<WaitlistUser[][], WaitlistUser[]>(
  flatten
);

export const hasUserVoted = (
  user: WaitlistUser | Account,
  usedVotes: WaitlistVote[]
): boolean => {
  return Boolean(
    usedVotes.find((vote) => vote.voteForUserPublicKey === user.publicKey)
  );
};

export const getUserVoteCount = (
  user: WaitlistUser,
  usedVotesCount: number
): number => {
  const TOTAL_VOTES = 5;
  let remainingVotes = TOTAL_VOTES - usedVotesCount;
  if (user?.hiddenAt || isFlaggedForModeration(user?.moderationStatus)) {
    // Users under review may not vote
    remainingVotes = 0;
  }
  if (remainingVotes <= 0) {
    return 0;
  }
  return remainingVotes;
};

export const getCreators = compose<
  AccountFeed[][],
  AccountFeed[],
  AccountFeed[]
>(uniqBy(prop<string>('publicKey')), flatten);

export const hasUserMigrated = when(
  notEmptyOrNil,
  propIs(String, 'migratedToUser')
);

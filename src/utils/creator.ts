import {
  compose,
  map,
  prop,
  values,
  indexOf,
  sort,
  toLower,
  any,
  curry,
  T,
  dissoc,
  when,
} from 'ramda';

import Account, { AccountFeed } from 'types/Account';
import SocialLinkMap from 'types/SocialLink';

import { maybeLowerCase } from 'utils/case';
import { notEmptyOrNil } from './helpers';

export function getSymbolFromCreator(creator: Account): string {
  return maybeLowerCase(creator?.username);
}

export const getSocialHandles = compose(map(prop('handle')), values);

export const getHasSocialHandles = compose<
  SocialLinkMap,
  Omit<SocialLinkMap, 'instagram'>,
  Omit<SocialLinkMap, 'instagram' | 'twitter'>,
  string[],
  boolean
>(
  // are any hanldes present
  any(notEmptyOrNil),
  // get just the handles in an array
  getSocialHandles,
  // remove twitter from the links
  dissoc('twitter'),
  // remove instagram from the links
  dissoc('instagram')
);

export const sortCreatorsByUsernames = (
  creatorUsernames: string[],
  creators: Account[]
): Account[] => {
  return sort<Account>((a, b) => {
    const lowerCaseUsernames = map(toLower, creatorUsernames);
    const firstIndex = indexOf(toLower(a.username), lowerCaseUsernames);
    const secondIndex = indexOf(toLower(b.username), lowerCaseUsernames);
    return firstIndex - secondIndex;
  }, creators);
};

export const sortCreatorsByPublicKeys = (
  publicKeys: string[],
  creators: AccountFeed[]
): AccountFeed[] => {
  return sort<AccountFeed>((a, b) => {
    const lowerCasePublicKeys = map(toLower, publicKeys);
    const firstIndex = indexOf(toLower(a.publicKey), lowerCasePublicKeys);
    const secondIndex = indexOf(toLower(b.publicKey), lowerCasePublicKeys);
    return firstIndex - secondIndex;
  }, creators);
};

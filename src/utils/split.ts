import { lensProp, over, map } from 'ramda';

import { areKeysEqual } from 'utils/users';

import PercentSplit, { PercentSplitShare } from 'types/PercentSplit';
import Account from 'types/Account';
import { PercentSplitWithUsers } from 'types/Split';

export function buildPercentToUse(count: number, index?: number): number {
  return count === 3 && index === 0
    ? Number((100 / count + 0.01).toFixed(2))
    : Number((100 / count).toFixed(2));
}

export const mergePercentSplitsWithUsers = (
  percentSplit: PercentSplit,
  users: Account[]
): PercentSplitWithUsers =>
  over<any, PercentSplitShare[]>(
    lensProp('shares'),
    map((share) => {
      const matchedUser = users.find((user) =>
        areKeysEqual([user.publicKey, share.account.id])
      );
      const fallbackUser: Account = {
        publicKey: share.account.id,
      };
      return { ...share, user: matchedUser ?? fallbackUser };
    }),
    percentSplit
  );

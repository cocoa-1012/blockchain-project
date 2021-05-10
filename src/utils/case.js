import {
  anyPass,
  toLower,
  toUpper,
  curry,
  isEmpty,
  ifElse,
  isNil,
  identity,
} from 'ramda';

export const maybeChangeCase = curry((predicate, val) =>
  ifElse(anyPass([isNil, isEmpty]), identity, predicate)(val)
);

export const maybeLowerCase = maybeChangeCase(toLower);
export const maybeUpperCase = maybeChangeCase(toUpper);

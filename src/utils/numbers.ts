import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatEther, parseUnits } from '@ethersproject/units';
import { compose } from 'ramda';

export const fromBNDec = compose<BigNumber, string, number>(
  Number,
  formatEther
);

export const toBNFixed = (n: BigNumberish): string => {
  const value = n.toString();
  return parseUnits(value).toString();
};

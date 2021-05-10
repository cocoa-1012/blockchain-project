import { BigNumber } from '@ethersproject/bignumber';

import { GAS_MARGIN, PERCENT } from 'utils/constants/gas';

// Return 1.1 times the value
export function calculateGasMargin(value: BigNumber): BigNumber {
  const offset = value.mul(GAS_MARGIN).div(PERCENT);
  return value.add(offset);
}

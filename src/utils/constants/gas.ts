import getChainId from 'lib/chainId';
const chainId = getChainId();

export const gasLimitEstimationWorks = chainId === 1 || chainId === 3;
export const gasPriceEstimationWorks = chainId === 1 || chainId === 3;

export const GAS_MARGIN = 1000; // 10% in basis
export const PERCENT = 10000; // 10

export const DUST_AMOUNT = 0.001;

// TODO: Potentially pick a different hardcoded value
// for Sokol vs. xDai vs. Kovan
// "the gasPrice is fixed on Sokol and validators will accept valid transactions with 1 Gwei gas"
// Source: https://forum.poa.network/t/getting-error-the-execution-failed-due-to-an-exception-in-sokol-rpc-call-eth-estimategas/1747

// 1 gwei is supposed to work consistently on Sokol
export const HARDCODED_GAS_PRICE = '1000000000'; // 1 gwei in wei
// TODO: Dry this up with the HARDCODED_GAS_PRICE usage
export const HARDCODED_GWEI_PRICE = 1; // 1 gwei in gwei

// Note: We can't trust the gas price that the Sokol
// block explorer displays
// https://blockscout.com/poa/sokol

// TODO: Potentially pick a value based on our local results
// of how much gas buy, sell, and redeem require
// export const HARDCODED_GAS_ESTIMATE = '9000000'; // 9 million
export const HARDCODED_GAS_ESTIMATE = '500000'; // 500k

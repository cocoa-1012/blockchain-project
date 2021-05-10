import getChainId from 'lib/chainId';
import addresses from '@f8n/f8n-contracts/src/addresses/addresses';

// TODO: Make this dynamic based on env (staging vs. prod, and chainId)
const deploymentEnv = process.env.NEXT_PUBLIC_APP_ENV;

const contractAddressEnv = deploymentEnv === 'production' ? 'prod' : 'staging';

// Don't use get() - we want an exception if there's no address returned or if internally
// there's an incorrect chain returned
export function getAddress(contractName: string): string {
  const chainId = getChainId();
  // const chainId = getChainId();
  return addresses[contractAddressEnv][chainId][contractName];
}

// NFT Market

export function getNFTMarketAddress(): string {
  return getAddress('nftMarket');
}

// NFT Contract

export function getNFT721Address(): string {
  return getAddress('nft721');
}

// Split

export function getSplitAddress(): string {
  return getAddress('percentSplit');
}

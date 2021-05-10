const etherscanAddresses = {
  // Mainnet
  1: 'https://etherscan.io',
  // Ropsten
  3: 'https://ropsten.etherscan.io',
  // Goerli
  5: 'https://goerli.etherscan.io',
  // Sokol
  77: 'https://blockscout.com/poa/sokol',
  // xDai
  100: 'https://blockscout.com/poa/xdai',
};

// We want an exception if there's no etherscan address returned
export function getEtherscanAddress(chainId: number): string {
  return etherscanAddresses[chainId];
}

export function buildEtherscanLink(path: string): string {
  const NEXT_PUBLIC_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
  const etherscanAddress = getEtherscanAddress(NEXT_PUBLIC_CHAIN_ID);
  const etherscanURL = new URL(path, etherscanAddress);
  return etherscanURL.href;
}

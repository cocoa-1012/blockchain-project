const subgraphApis = {
  // Mainnet
  // 1: 'https://api.thegraph.com/subgraphs/name/f8n/fnd',
  // 1: 'https://subgraph.foundation.app', // Cloudflare worker pointing to Figment
  1: 'https://subgraph.fndsubgraph.com', // Failover endpoint that swaps between The Graph and Cloudflare+Figment
  // Ropsten
  3: 'https://goerli-subgraph.foundation.app', // Note: Not really using Ropsten
  // Rinkeby
  4: 'https://goerli-subgraph.foundation.app', // Note: Not really using Rinkeby
  // Goerli
  // 5: 'https://api.thegraph.com/subgraphs/name/f8n/fnd-goerli',
  // 5: `https://graph--foundation-goerli.datahub.figment.io/apikey/${process.env.NEXT_PUBLIC_FIGMENT_API_KEY}/subgraphs/name/FoundationContract`,
  5: `https://goerli-subgraph.foundation.app`,
  // Sokol
  77: 'https://api.thegraph.com/subgraphs/name/f8n/f8n-sokol',
  // xDai
  100: 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai',
};

// Don't use get() - we want an exception if there's no graph API returned
export function getSubgraphApi(chainId: number): string {
  return subgraphApis[chainId];
}

const daiSubgraphApis = {
  // Mainnet
  1: 'https://api.thegraph.com/subgraphs/name/f8n/dai-mainnet',
  // Ropsten
  3: 'https://api.thegraph.com/subgraphs/name/f8n/dai-ropsten',
};

// Don't use get() - we want an exception if there's no graph API returned
export function getDaiSubgraphApi(chainId: number): string {
  return daiSubgraphApis[chainId];
}

import {
  getNFTMarketAddress,
  getNFT721Address,
  getSplitAddress,
} from 'lib/addresses';
import { Signer } from '@ethersproject/abstract-signer';
import { JsonRpcProvider } from '@ethersproject/providers';

// TODO: Debug
// import/export type syntax for .d.ts files
import {
  FNDNFT721__factory,
  FNDNFTMarket__factory,
  FNDNFTMarket,
  FNDNFT721,
  PercentSplit,
  PercentSplit__factory,
} from '@f8n/f8n-contracts/src/typechain';

const nftMarketAddr = getNFTMarketAddress();
const nft721Addr = getNFT721Address();
const splitAddr = getSplitAddress();

let nftMarketContract: FNDNFTMarket;
let nft721Contract: FNDNFT721;
let nftMarketContractToRead: FNDNFTMarket;
let nft721ContractToRead: FNDNFT721;
let splitContractToRead: PercentSplit;

export function getNFTMarketContract(signer: Signer): FNDNFTMarket {
  if (!nftMarketContract && signer) {
    nftMarketContract = FNDNFTMarket__factory.connect(nftMarketAddr, signer);
  }
  return nftMarketContract;
}

export function getNFTMarketContractToRead(
  provider: JsonRpcProvider
): FNDNFTMarket {
  if (!nftMarketContractToRead && provider) {
    nftMarketContractToRead = FNDNFTMarket__factory.connect(
      nftMarketAddr,
      provider
    );
  }
  return nftMarketContractToRead;
}

export function getNFT721Contract(signer: Signer): FNDNFT721 {
  if (!nft721Contract && signer) {
    nft721Contract = FNDNFT721__factory.connect(nft721Addr, signer);
  }
  return nft721Contract;
}

export function getNFT721ContractToRead(provider: JsonRpcProvider): FNDNFT721 {
  if (!nft721ContractToRead && provider) {
    nft721ContractToRead = FNDNFT721__factory.connect(nft721Addr, provider);
  }
  return nft721ContractToRead;
}

export function getSplitContractToRead(
  provider: JsonRpcProvider
): PercentSplit {
  if (!splitContractToRead && provider) {
    splitContractToRead = PercentSplit__factory.connect(splitAddr, provider);
  }
  return splitContractToRead;
}

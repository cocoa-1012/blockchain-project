import { BigNumberish } from '@ethersproject/bignumber';
import { ContractTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

import { RevenueShare } from './Share';

// Note: Finalize flow uses Claim enum option here since
// the smart contract method is the same
export enum MethodEnum {
  Bid = 'placeBid',
  FirstMint = 'mintAndApproveMarket',
  Transfer = 'safeTransferFrom',
  AdditionalMint = 'mint',
  List = 'createReserveAuction',
  Unlist = 'cancelReserveAuction',
  Approve = 'setApprovalForAll',
  Settle = 'finalizeReserveAuction',
  ChangePrice = 'updateReserveAuction',
  Burn = 'burn',
  MintWithSplit = 'mintWithCreatorPaymentFactoryAndApproveMarket',
}

export interface SendMarketTransactionBidParams {
  price: string;
  auctionId: BigNumberish;
}

export interface SendMarketTransactionClaimParams {
  auctionId: BigNumberish;
}

export interface SendNFTTransactionMintParams {
  tokenIPFSPath: string;
  isFirstTime?: boolean;
}

export interface SendNFTTransactionTransferParams {
  from: string;
  to: string;
  tokenId: BigNumberish;
}

export interface SendNFTTransactionBurnParams {
  tokenId: BigNumberish;
}

export interface SendMarketTransactionListParams {
  nftContract: string;
  id: BigNumberish;
  reservePrice: BigNumberish;
}

export interface SendMarketTransactionChangePriceParams {
  auctionId: BigNumberish;
  reservePrice: BigNumberish;
}

export interface SendMarketTransactionUnlistParams {
  auctionId: BigNumberish;
}

export interface SendNFTTransactionMintWithSplitParams {
  tokenIPFSPath: string;
  shares: RevenueShare[];
  isFirstTime?: boolean;
}

// Note: No such thing as SendNFTTransactionApproveParams
// since it would be {} which doesn't warrant creating an interface

export interface SendMarketTxResponse {
  tx: ContractTransaction;
  txHash: string;
}

export interface SendTransactionSharedParams {
  provider: JsonRpcProvider;
  estimateGasProvider: JsonRpcProvider;
  gasData?: any;
}

export interface BidParams
  extends SendTransactionSharedParams,
    SendMarketTransactionBidParams {}

export interface ClaimParams
  extends SendTransactionSharedParams,
    SendMarketTransactionClaimParams {}

export interface MintParams
  extends SendTransactionSharedParams,
    SendNFTTransactionMintParams {}

export interface TransferParams
  extends SendTransactionSharedParams,
    SendNFTTransactionTransferParams {}

export interface BurnParams
  extends SendTransactionSharedParams,
    SendNFTTransactionBurnParams {}

export interface ListParams
  extends SendTransactionSharedParams,
    SendMarketTransactionListParams {}

export interface ChangePriceParams
  extends SendTransactionSharedParams,
    SendMarketTransactionChangePriceParams {}

export interface UnlistParams
  extends SendTransactionSharedParams,
    SendMarketTransactionUnlistParams {}

export interface MintWithSplitParams
  extends SendTransactionSharedParams,
    SendNFTTransactionMintWithSplitParams {}

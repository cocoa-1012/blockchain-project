/* eslint-disable max-lines */
import { toBNFixed } from 'utils/numbers';
import {
  getNFT721Contract,
  getNFT721ContractToRead,
  getNFTMarketContract,
  getNFTMarketContractToRead,
} from 'lib/contracts';

import { calculateGasMargin } from 'utils/gas';
import {
  SendTransactionSharedParams,
  SendMarketTxResponse,
  ListParams,
  TransferParams,
  ClaimParams,
  BidParams,
  UnlistParams,
  MintParams,
  BurnParams,
  ChangePriceParams,
} from 'types/NFTMarketInterface';
import { getNFTMarketAddress } from 'lib/addresses';

// Note: No such thing as SendNFTTransactionApproveParams
// since it's {} which doesn't warrant being an interface
type ApproveParams = SendTransactionSharedParams;

export async function sendNFTMarketBidTransaction({
  price = '0',
  provider,
  estimateGasProvider,
  gasData,
  auctionId,
}: BidParams): Promise<SendMarketTxResponse> {
  const bnAmount = toBNFixed(price);

  const txArg = auctionId;
  const value = bnAmount;
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nftMarketContract = getNFTMarketContract(signer);

  const signerAddress = signer.getAddress();

  const nftMarketContractForEstimation = getNFTMarketContractToRead(
    estimateGasProvider
  );

  const estimatedGas = await nftMarketContractForEstimation.estimateGas.placeBid(
    txArg,
    {
      // TODO: Determine if this works as an override
      from: signerAddress,
      value: value,
    }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
    value: value,
  };

  const tx = await nftMarketContract.placeBid(txArg, txOptions);

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTMarketClaimTransaction({
  provider,
  estimateGasProvider,
  gasData,
  auctionId,
}: ClaimParams): Promise<SendMarketTxResponse> {
  const txArg = auctionId;
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nftMarketContract = getNFTMarketContract(signer);

  const signerAddress = signer.getAddress();

  const nftMarketContractForEstimation = getNFTMarketContractToRead(
    estimateGasProvider
  );

  const estimatedGas = await nftMarketContractForEstimation.estimateGas.finalizeReserveAuction(
    txArg,
    {
      from: signerAddress,
    }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // TODO: Make sure we pick the right gas price on mainnet
  // and make sure 1 works for Goerli

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nftMarketContract.finalizeReserveAuction(txArg, txOptions);

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTMintTransaction({
  provider,
  estimateGasProvider,
  gasData,
  tokenIPFSPath,
  isFirstTime = true,
}: MintParams): Promise<SendMarketTxResponse> {
  const txArg: string = tokenIPFSPath;
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nft721Contract = getNFT721Contract(signer);

  const signerAddress = signer.getAddress();

  const nft721ContractForEstimation = getNFT721ContractToRead(
    estimateGasProvider
  );

  const estimatedGas = isFirstTime
    ? await nft721ContractForEstimation.estimateGas.mintAndApproveMarket(
        txArg,
        {
          from: signerAddress,
        }
      )
    : await nft721ContractForEstimation.estimateGas.mint(txArg, {
        from: signerAddress,
      });

  const gasLimit = calculateGasMargin(estimatedGas);

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = isFirstTime
    ? await nft721Contract.mintAndApproveMarket(txArg, txOptions)
    : await nft721Contract.mint(txArg, txOptions);

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

// TODO: Have a separate tx or an arg to handle mint vs. mintAndApproveMarket

export async function sendNFTTransferTransaction({
  provider,
  estimateGasProvider,
  gasData,
  from,
  to,
  tokenId,
}: TransferParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nft721Contract = getNFT721Contract(signer);

  const signerAddress = signer.getAddress();

  const nft721ContractForEstimation = getNFT721ContractToRead(
    estimateGasProvider
  );

  const estimatedGas = await nft721ContractForEstimation.estimateGas[
    'safeTransferFrom(address,address,uint256)'
  ](from, to, tokenId, { from: signerAddress });

  const gasLimit = calculateGasMargin(estimatedGas);

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nft721Contract['safeTransferFrom(address,address,uint256)'](
    from,
    to,
    tokenId,
    txOptions
  );

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTBurnTransaction({
  provider,
  estimateGasProvider,
  gasData,
  tokenId,
}: BurnParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nft721Contract = getNFT721Contract(signer);

  const signerAddress = signer.getAddress();

  const nft721ContractForEstimation = getNFT721ContractToRead(
    estimateGasProvider
  );

  const estimatedGas = await nft721ContractForEstimation.estimateGas.burn(
    tokenId,
    { from: signerAddress }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nft721Contract.burn(tokenId, txOptions);

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTMarketListTransaction({
  provider,
  estimateGasProvider,
  // gasData,
  nftContract,
  id,
  reservePrice,
}: ListParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nftMarketContract = getNFTMarketContract(signer);

  const signerAddress = signer.getAddress();

  const nftMarketContractForEstimation = getNFTMarketContractToRead(
    estimateGasProvider
  );

  const estimatedGas = await nftMarketContractForEstimation.estimateGas.createReserveAuction(
    nftContract,
    id,
    reservePrice,
    { from: signerAddress }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // TODO: Make sure we pick the right gas price on mainnet
  // and make sure 1 works for Goerli

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nftMarketContract.createReserveAuction(
    nftContract,
    id,
    reservePrice,
    txOptions
  );

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTMarketUnlistTransaction({
  provider,
  estimateGasProvider,
  // gasData,
  auctionId,
}: UnlistParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nftMarketContract = getNFTMarketContract(signer);

  const signerAddress = signer.getAddress();

  const nftMarketContractForEstimation = getNFTMarketContractToRead(
    estimateGasProvider
  );

  const estimatedGas = await nftMarketContractForEstimation.estimateGas.cancelReserveAuction(
    auctionId,
    { from: signerAddress }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // TODO: Make sure we pick the right gas price on mainnet
  // and make sure 1 works for Goerli

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nftMarketContract.cancelReserveAuction(auctionId, txOptions);

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTApproveTransaction({
  provider,
  estimateGasProvider,
}: // gasData,
ApproveParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nft721Contract = getNFT721Contract(signer);
  const signerAddress = signer.getAddress();

  const nft721ContractForEstimation = getNFT721ContractToRead(
    estimateGasProvider
  );
  const nftMarketAddr = getNFTMarketAddress();

  const estimatedGas = await nft721ContractForEstimation.estimateGas.setApprovalForAll(
    nftMarketAddr,
    true,
    { from: signerAddress }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // TODO: Make sure we pick the right gas price on mainnet
  // and make sure 1 works for Goerli

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nft721Contract.setApprovalForAll(
    nftMarketAddr,
    true,
    txOptions
  );

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTMarketChangePriceTransaction({
  provider,
  estimateGasProvider,
  // gasData,
  auctionId,
  reservePrice,
}: ChangePriceParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nftMarketContract = getNFTMarketContract(signer);

  const signerAddress = signer.getAddress();

  const nftMarketContractForEstimation = getNFTMarketContractToRead(
    estimateGasProvider
  );

  const estimatedGas = await nftMarketContractForEstimation.estimateGas.updateReserveAuction(
    auctionId,
    reservePrice,
    { from: signerAddress }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // TODO: Make sure we pick the right gas price on mainnet
  // and make sure 1 works for Goerli

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nftMarketContract.updateReserveAuction(
    auctionId,
    reservePrice,
    txOptions
  );

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

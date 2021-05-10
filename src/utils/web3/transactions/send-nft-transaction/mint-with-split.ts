/* eslint-disable max-lines */
import {
  getNFT721Contract,
  getNFT721ContractToRead,
  getSplitContractToRead,
} from 'lib/contracts';
import { getSplitAddress } from 'lib/addresses';
import { BigNumber } from '@ethersproject/bignumber';

import { calculateGasMargin } from 'utils/gas';
import {
  SendMarketTxResponse,
  MintWithSplitParams,
} from 'types/NFTMarketInterface';
import { ShareDataContract } from 'types/Share';

export default async function sendNFTMintWithSplitTransaction({
  provider,
  estimateGasProvider,
  tokenIPFSPath,
  shares,
}: MintWithSplitParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nft721Contract = getNFT721Contract(signer);

  const splitAddress = getSplitAddress();

  // TODO: Use split contract address as an arg

  const signerAddress = signer.getAddress();

  const nft721ContractForEstimation = getNFT721ContractToRead(
    estimateGasProvider
  );

  const splitContractForCalldata = getSplitContractToRead(estimateGasProvider);

  const sharesContract: ShareDataContract[] = shares.map((share) => {
    return {
      recipient: share.address,
      percentInBasisPoints: BigNumber.from(
        (share.shareInPercentage * 100).toFixed(0)
      ),
    };
  });

  console.log({ sharesContract });

  const sharesContractSorted = sharesContract.sort(function (a, b) {
    const recipientA = a.recipient.toUpperCase(); // ignore upper and lowercase
    const recipientB = b.recipient.toUpperCase(); // ignore upper and lowercase
    if (recipientA < recipientB) {
      return -1;
    }
    if (recipientA > recipientB) {
      return 1;
    }

    // recipients must be equal (we shouldn't encounter this case)
    return 0;
  });

  // TODO: Handle second mint like for sendNFTMintTransaction with mint vs. mintAndApproveMarket
  // based on isFirstTime arg

  const callData = splitContractForCalldata.interface.encodeFunctionData(
    'createSplit',
    [sharesContractSorted]
  );

  console.log({ callData });

  const estimatedGas = await nft721ContractForEstimation.estimateGas.mintWithCreatorPaymentFactoryAndApproveMarket(
    tokenIPFSPath,
    splitAddress,
    callData,
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

  // string memory tokenIPFSPath,
  // address paymentAddressFactory,
  // bytes memory paymentAddressCallData
  const tx = await nft721Contract.mintWithCreatorPaymentFactoryAndApproveMarket(
    tokenIPFSPath,
    splitAddress,
    callData,
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

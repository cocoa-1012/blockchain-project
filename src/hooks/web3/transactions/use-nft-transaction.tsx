/* eslint-disable max-lines */
import { useState } from 'react';
import * as Sentry from '@sentry/react';
import { useWeb3React } from '@web3-react/core';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';

import {
  sendNFTMarketBidTransaction,
  sendNFTMarketClaimTransaction,
  sendNFTMintTransaction,
  sendNFTTransferTransaction,
  sendNFTMarketListTransaction,
  sendNFTMarketUnlistTransaction,
  sendNFTMarketChangePriceTransaction,
  sendNFTBurnTransaction,
  sendNFTApproveTransaction,
} from 'utils/web3/transactions/send-nft-transaction';

import sendNFTMintWithSplitTransaction from 'utils/web3/transactions/send-nft-transaction/mint-with-split';

import {
  MethodEnum,
  SendMarketTransactionBidParams,
  SendMarketTransactionClaimParams,
  SendMarketTransactionListParams,
  SendMarketTransactionUnlistParams,
  SendMarketTransactionChangePriceParams,
  SendNFTTransactionMintParams,
  SendNFTTransactionMintWithSplitParams,
  SendNFTTransactionTransferParams,
  SendNFTTransactionBurnParams,
} from 'types/NFTMarketInterface';

import useReadOnlyProvider from '../use-read-only-provider';
import { getError } from 'utils/helpers';

interface UseNFTTransactionProps {
  method: MethodEnum;
}

interface SendTransactionSharedParams {
  shouldWait?: boolean;
}

interface SendTransactionBidParamsWithShared
  extends SendTransactionSharedParams,
    SendMarketTransactionBidParams {}

interface SendTransactionClaimParamsWithShared
  extends SendTransactionSharedParams,
    SendMarketTransactionClaimParams {}

interface SendTransactionMintParamsWithShared
  extends SendTransactionSharedParams,
    SendNFTTransactionMintParams {}

interface SendTransactionMintWithSplitParamsWithShared
  extends SendTransactionSharedParams,
    SendNFTTransactionMintWithSplitParams {}

interface SendTransactionTransferParamsWithShared
  extends SendTransactionSharedParams,
    SendNFTTransactionTransferParams {}

interface SendTransactionBurnParamsWithShared
  extends SendTransactionSharedParams,
    SendNFTTransactionBurnParams {}

interface SendTransactionListParamsWithShared
  extends SendTransactionSharedParams,
    SendMarketTransactionListParams {}

interface SendTransactionUnlistParamsWithShared
  extends SendTransactionSharedParams,
    SendMarketTransactionUnlistParams {}

interface SendTransactionChangePriceParamsWithShared
  extends SendTransactionSharedParams,
    SendMarketTransactionChangePriceParams {}

type SendTransactionApproveParams = SendTransactionSharedParams;

export default function useNFTTransaction({
  method,
}: UseNFTTransactionProps): {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error;
  isProviderLoading: boolean;
  sendBidTransaction: (
    arg0: SendTransactionBidParamsWithShared
  ) => Promise<string>;
  sendClaimTransaction: (
    arg0: SendTransactionClaimParamsWithShared
  ) => Promise<string>;
  sendMintTransaction: (
    arg0: SendTransactionMintParamsWithShared
  ) => Promise<string>;
  sendMintWithSplitTransaction: (
    arg0: SendTransactionMintWithSplitParamsWithShared
  ) => Promise<string>;
  sendTransferTransaction: (
    arg0: SendTransactionTransferParamsWithShared
  ) => Promise<string>;
  sendBurnTransaction: (
    arg0: SendTransactionBurnParamsWithShared
  ) => Promise<string>;
  sendListTransaction: (
    arg0: SendTransactionListParamsWithShared
  ) => Promise<string>;
  sendUnlistTransaction: (
    arg0: SendTransactionUnlistParamsWithShared
  ) => Promise<string>;
  sendApproveTransaction: (
    arg0: SendTransactionApproveParams
  ) => Promise<string>;
  sendChangePriceTransaction: (
    arg0: SendTransactionChangePriceParamsWithShared
  ) => Promise<string>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [error, setError] = useState(null);
  const {
    library: provider,
    active: isProviderActiveFromHook,
  } = useWeb3React();

  const {
    provider: estimateGasProvider,
    isLoading: isReadOnlyLoading,
  } = useReadOnlyProvider();

  const { isWrongNetwork } = useIsWrongNetwork();

  const hookItselfIsLoading = !isProviderActiveFromHook;

  if (isWrongNetwork) {
    // TODO: Put similar return to hookItselfIsLoading case below
  }

  if (hookItselfIsLoading) {
    return {
      sendBidTransaction: async () => {
        return ''; // do nothing
      },
      sendClaimTransaction: async () => {
        return ''; // do nothing
      },
      sendMintTransaction: async () => {
        return ''; // do nothing
      },
      sendMintWithSplitTransaction: async () => {
        return ''; // do nothing
      },
      sendTransferTransaction: async () => {
        return ''; // do nothing
      },
      sendBurnTransaction: async () => {
        return ''; // do nothing
      },
      sendListTransaction: async () => {
        return ''; // do nothing
      },
      sendUnlistTransaction: async () => {
        return ''; // do nothing
      },
      sendApproveTransaction: async () => {
        return ''; // do nothing
      },
      sendChangePriceTransaction: async () => {
        return ''; // do nothing
      },
      isLoading,
      isError,
      error,
      isSuccess,
      isProviderLoading: hookItselfIsLoading,
    };
  }

  async function sendBidTransaction({
    auctionId,
    price,
    shouldWait = false,
  }: SendTransactionBidParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Bid) {
        throw new Error('Methods other than placeBid not supported');
      }
      const { tx, txHash } = await sendNFTMarketBidTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        price,
        auctionId,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendClaimTransaction({
    auctionId,
    shouldWait = false,
  }: SendTransactionClaimParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Settle) {
        throw new Error(
          'Methods other than finalizeReserveAuction not supported'
        );
      }
      const { tx, txHash } = await sendNFTMarketClaimTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        auctionId,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendMintTransaction({
    shouldWait = false,
    tokenIPFSPath,
    isFirstTime = true,
  }: SendTransactionMintParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.FirstMint) {
        throw new Error('Methods other than mint not supported');
      }
      if (!tokenIPFSPath) {
        throw new Error('Token IPFS Path not defined');
      }
      const { tx, txHash } = await sendNFTMintTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        tokenIPFSPath,
        isFirstTime,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendMintWithSplitTransaction({
    shouldWait = false,
    tokenIPFSPath,
    shares,
  }: SendTransactionMintWithSplitParamsWithShared) {
    console.log('Mint with split called');
    setIsLoading(true);
    try {
      if (method !== MethodEnum.MintWithSplit) {
        throw new Error('Methods other than mint not supported');
      }
      if (!tokenIPFSPath) {
        throw new Error('Token IPFS Path not defined');
      }
      const { tx, txHash } = await sendNFTMintWithSplitTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        tokenIPFSPath,
        shares,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendTransferTransaction({
    shouldWait = false,
    from,
    to,
    tokenId,
  }: SendTransactionTransferParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Transfer) {
        throw new Error('Methods other than transfer not supported');
      }
      const { tx, txHash } = await sendNFTTransferTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        from,
        to,
        tokenId,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendBurnTransaction({
    shouldWait = false,
    tokenId,
  }: SendTransactionBurnParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Burn) {
        throw new Error('Methods other than transfer not supported');
      }
      const { tx, txHash } = await sendNFTBurnTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        tokenId,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendListTransaction({
    shouldWait = false,
    nftContract,
    id,
    reservePrice,
  }: SendTransactionListParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.List) {
        throw new Error('Methods other than list not supported');
      }
      const { tx, txHash } = await sendNFTMarketListTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        nftContract,
        id,
        reservePrice,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendUnlistTransaction({
    shouldWait = false,
    auctionId,
  }: SendTransactionUnlistParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Unlist) {
        throw new Error('Methods other than list not supported');
      }
      const { tx, txHash } = await sendNFTMarketUnlistTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        auctionId,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendApproveTransaction({
    shouldWait = false,
  }: SendTransactionApproveParams) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Approve) {
        throw new Error('Methods other than list not supported');
      }
      const { tx, txHash } = await sendNFTApproveTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendChangePriceTransaction({
    shouldWait = false,
    auctionId,
    reservePrice,
  }: SendTransactionChangePriceParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.ChangePrice) {
        throw new Error('Methods other than change price not supported');
      }
      const { tx, txHash } = await sendNFTMarketChangePriceTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        auctionId,
        reservePrice,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }
  return {
    sendBidTransaction,
    sendClaimTransaction,
    sendMintTransaction,
    sendMintWithSplitTransaction,
    sendTransferTransaction,
    sendBurnTransaction,
    sendListTransaction,
    sendUnlistTransaction,
    sendApproveTransaction,
    sendChangePriceTransaction,
    isLoading,
    isError,
    error,
    isSuccess,
    isProviderLoading: hookItselfIsLoading,
  };
}

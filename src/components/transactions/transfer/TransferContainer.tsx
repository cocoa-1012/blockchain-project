/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import useNextRoute from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import { getFirstValue, isValidTxHash } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import { isNonUserRejectedError } from 'utils/transactions';

import { MethodEnum } from 'types/NFTMarketInterface';
import { TransferFormValues } from './types';
import { ModalKey } from 'types/modal';

import { TransactionError } from '../TransactionError';
import TransferView from './TransferView';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';

interface TransferContainerProps {
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
  publicAddress: string;
}

export default function TransferContainer(
  props: TransferContainerProps
): JSX.Element {
  const { resetTransaction, isWrongNetwork, publicAddress } = props;

  const router = useRouter();
  const slug = getFirstValue(router?.query?.slug);

  const { setCurrentModal } = useModal();

  const tokenId = getTokenId(slug);

  // const assetIPFSPath = artwork?.assetIPFSPath;
  // const metadataIPFSPath = artwork?.metadataIPFSPath;

  const submittedRoute = useNextRoute('/transfer/submitted');

  const {
    sendTransferTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.Transfer });

  const handleEthereumTx = useCallback(
    async (values: TransferFormValues) => {
      if (isProviderLoading) {
        return setCurrentModal(ModalKey.AUTH_MAIN);
      }

      const tokenIdFromSlugInRouter = tokenId;

      const transferPayload = {
        to: values.to,
        from: publicAddress,
        tokenId: tokenIdFromSlugInRouter,
      };

      const txHash = await sendTransferTransaction(transferPayload);

      const hasValidTxHash = isValidTxHash(txHash);

      if (hasValidTxHash) {
        // TODO: @gosseti Decide if we want to push to a new route
        // when it has submitted or if we want to use
        // the isSuccess to show the component below
        await router.push({
          pathname: submittedRoute,
          query: { txHash },
        });
      }
    },
    [
      router,
      publicAddress,
      submittedRoute,
      sendTransferTransaction,
      tokenId,
      setCurrentModal,
      isProviderLoading,
    ]
  );

  // Keep showing loading state up until we redirect
  if (isLoading || isSuccess) {
    return <TransactionAwaitingConfirmation />;
  }

  if (isWrongNetwork) {
    return <MetaMaskError />;
  }

  if (isError && isNonUserRejectedError(error)) {
    return (
      <TransactionError error={error} resetTransaction={resetTransaction} />
    );
  }

  return <TransferView onSubmit={handleEthereumTx} />;
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';
import { useNextRouteCreator } from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import { getFirstValue, isValidTxHash } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import { isNonUserRejectedError } from 'utils/transactions';

import { TransactionError } from '../TransactionError';
import { MethodEnum } from 'types/NFTMarketInterface';
import { ModalKey } from 'types/modal';

import BurnView from './BurnView';
import MetaMaskError from 'components/auth/MetaMaskError';
import SpinnerStroked from 'components/SpinnerStroked';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';

interface BurnContainerProps {
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
}

export default function BurnContainer(props: BurnContainerProps): JSX.Element {
  const { resetTransaction, isWrongNetwork } = props;

  const router = useRouter();
  const slug = getFirstValue(router?.query?.slug);

  const tokenId = getTokenId(slug);

  const {
    data: artworkData,
    loading: isServerArtworkLoading,
    error: artworkError,
  } = useHasuraArtworkByTokenId({ tokenId });

  const { setCurrentModal } = useModal();

  const artwork = artworkData?.artwork;
  // const assetIPFSPath = artwork?.assetIPFSPath;
  // const metadataIPFSPath = artwork?.metadataIPFSPath;

  const submittedRoute = useNextRouteCreator('/burn/submitted');

  const {
    sendBurnTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.Burn });

  const handleEthereumTx = useCallback(async () => {
    if (isProviderLoading) {
      return setCurrentModal(ModalKey.AUTH_MAIN);
    }

    const tokenIdFromSlugInRouter = tokenId;

    const burnPayload = {
      tokenId: tokenIdFromSlugInRouter,
    };

    const txHash = await sendBurnTransaction(burnPayload);

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
  }, [
    router,
    submittedRoute,
    sendBurnTransaction,
    tokenId,
    isProviderLoading,
    setCurrentModal,
  ]);

  if (isServerArtworkLoading) {
    return <SpinnerStroked size={44} />;
  }

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

  return <BurnView onSubmit={handleEthereumTx} artwork={artwork} />;
}

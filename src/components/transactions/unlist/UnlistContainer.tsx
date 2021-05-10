/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';
import { useSubgraphArtworkByTokenId } from 'hooks/queries/subgraph/use-artwork-by-token-id';
import useNextRoute from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import { getFirstValue, isValidTxHash } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import { isNonUserRejectedError } from 'utils/transactions';

import { ModalKey } from 'types/modal';
import { MethodEnum } from 'types/NFTMarketInterface';
import Artwork from 'types/Artwork';

import LoadingPage from 'components/LoadingPage';
import UnlistView from './UnlistView';
import { TransactionError } from '../TransactionError';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';

interface UnlistContainerProps {
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
}

// TODO: Confirm that this flow still works well after
// removing the formik element
export default function UnlistContainer(
  props: UnlistContainerProps
): JSX.Element {
  const { resetTransaction, isWrongNetwork } = props;

  const router = useRouter();
  const slug = getFirstValue(router?.query?.slug);

  const tokenId = getTokenId(slug);

  const { setCurrentModal } = useModal();

  const {
    data: nftData,
    loading: isSubgraphNftLoading,
    error: nftError,
  } = useSubgraphArtworkByTokenId(tokenId);

  const nfts = nftData?.artworks ?? [];

  const nft: Artwork = getFirstValue(nfts);

  const mostRecentActiveAuction = nft?.mostRecentActiveAuction;
  const auctionId = mostRecentActiveAuction?.auctionId;

  // const assetIPFSPath = artwork?.assetIPFSPath;
  // const metadataIPFSPath = artwork?.metadataIPFSPath;

  // TODO: Use user route rather than creator route
  const submittedRoute = useNextRoute('/unlist/submitted');

  const {
    sendUnlistTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.Unlist });

  const handleEthereumTx = useCallback(async () => {
    if (isProviderLoading) {
      return setCurrentModal(ModalKey.AUTH_MAIN);
    }

    if (!auctionId) {
      return;
    }
    const unlistPayload = {
      auctionId: auctionId,
    };

    const txHash = await sendUnlistTransaction(unlistPayload);

    const hasValidTxHash = isValidTxHash(txHash);

    if (hasValidTxHash) {
      await router.push({
        pathname: submittedRoute,
        query: { txHash },
      });
    }
  }, [
    auctionId,
    sendUnlistTransaction,
    router,
    submittedRoute,
    setCurrentModal,
    isProviderLoading,
  ]);

  if (isSubgraphNftLoading) {
    return <LoadingPage />;
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

  return <UnlistView onSubmit={handleEthereumTx} />;
}

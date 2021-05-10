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
import { toBNFixed } from 'utils/numbers';
import { isNonUserRejectedError } from 'utils/transactions';

import { ChangePriceFormValues } from './types';
import { MethodEnum } from 'types/NFTMarketInterface';
import Artwork from 'types/Artwork';
import { ModalKey } from 'types/modal';

import { TransactionError } from '../TransactionError';
import ChangePriceView from './ChangePriceView';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';
import SpinnerStroked from 'components/SpinnerStroked';

interface ChangePriceContainerProps {
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
}

export default function ChangePriceContainer(
  props: ChangePriceContainerProps
): JSX.Element {
  const { resetTransaction, isWrongNetwork } = props;

  const router = useRouter();
  const slug = getFirstValue(router?.query?.slug);

  const tokenId = getTokenId(slug);

  const {
    data: artworkData,
    loading: isServerArtworkLoading,
  } = useHasuraArtworkByTokenId({ tokenId });

  const {
    data: nftData,
    loading: isSubgraphNftLoading,
  } = useSubgraphArtworkByTokenId(tokenId);

  const { setCurrentModal } = useModal();

  const nfts = nftData?.artworks ?? [];

  const nft: Artwork = getFirstValue(nfts);

  const mostRecentActiveAuction = nft?.mostRecentActiveAuction;
  const auctionId = mostRecentActiveAuction?.auctionId;

  const artwork = artworkData?.artwork;
  // const assetIPFSPath = artwork?.assetIPFSPath;
  // const metadataIPFSPath = artwork?.metadataIPFSPath;

  // TODO: Use user route rather than creator route
  const submittedRoute = useNextRoute('/change-price/submitted');

  const {
    sendChangePriceTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.ChangePrice });

  const handleEthereumTx = useCallback(
    async (values: ChangePriceFormValues) => {
      if (isProviderLoading) {
        return setCurrentModal(ModalKey.AUTH_MAIN);
      }

      const price = Number(values?.price);

      if (!auctionId) {
        return;
      }
      const changePricePayload = {
        auctionId: auctionId,
        reservePrice: toBNFixed(price),
      };

      const txHash = await sendChangePriceTransaction(changePricePayload);

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
      auctionId,
      sendChangePriceTransaction,
      router,
      submittedRoute,
      isProviderLoading,
      setCurrentModal,
    ]
  );

  if (isServerArtworkLoading || isSubgraphNftLoading) {
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

  return <ChangePriceView onSubmit={handleEthereumTx} artwork={artwork} />;
}

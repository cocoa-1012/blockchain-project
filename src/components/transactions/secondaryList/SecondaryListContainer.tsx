/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import useArtworkByTokenId from 'hooks/queries/use-artwork-by-token-id';
import useNextRoute from 'hooks/use-next-route';
import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import { getFirstValue, isAnyTrue, isValidTxHash } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import { toBNFixed } from 'utils/numbers';
import { isNonUserRejectedError } from 'utils/transactions';

import { SecondaryListFormValues } from './types';
import { MethodEnum } from 'types/NFTMarketInterface';
import { CardVariant } from 'types/Card';
import { ModalKey } from 'types/modal';

import { getNFT721Address } from 'lib/addresses';

import LoadingPage from 'components/LoadingPage';
import SecondaryListView from './SecondaryListView';
import { TransactionError } from '../TransactionError';
import TransactionConfirm from 'components/transactions/generic/TransactionConfirm';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionContainer from '../TransactionContainer';

interface ListContainerProps {
  authToken: string;
  resetTransaction: () => void;
  publicAddress: string;
}

export default function ListContainer(props: ListContainerProps): JSX.Element {
  const { resetTransaction } = props;

  const router = useRouter();
  const slug = getFirstValue(router.query.slug);

  const tokenId = getTokenId(slug);

  const { isWrongNetwork } = useIsWrongNetwork();

  const { setCurrentModal } = useModal();

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByTokenId({ tokenId });

  const submittedRoute = useNextRoute('/list/submitted');

  const {
    sendListTransaction,
    isSuccess,
    isLoading: isTxLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.List });

  const handleEthereumTx = useCallback(
    async (values: SecondaryListFormValues) => {
      if (isProviderLoading) {
        return setCurrentModal(ModalKey.AUTH_MAIN);
      }

      const price = Number(values?.price);
      const nft721Address = getNFT721Address();
      const tokenIdFromSlugInRouter = tokenId;

      const listPayload = {
        nftContract: nft721Address,
        id: tokenIdFromSlugInRouter,
        reservePrice: toBNFixed(price),
      };

      const txHash = await sendListTransaction(listPayload);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // router,
      submittedRoute,
      sendListTransaction,
      tokenId,
    ]
  );

  const isLoading = isAnyTrue([isArtworkLoading]);

  if (isLoading) {
    return <LoadingPage />;
  }

  // Keep showing loading state up until we redirect
  if (isTxLoading || isSuccess) {
    return <TransactionConfirm artwork={artworkData} />;
  }

  if (isWrongNetwork) {
    return (
      <TransactionContainer
        artwork={artworkData}
        cardVariant={CardVariant.default}
      >
        <MetaMaskError />
      </TransactionContainer>
    );
  }

  if (isError && isNonUserRejectedError(error)) {
    return (
      <TransactionContainer
        artwork={artworkData}
        cardVariant={CardVariant.default}
      >
        <TransactionError error={error} resetTransaction={resetTransaction} />
      </TransactionContainer>
    );
  }

  return (
    <SecondaryListView onSubmit={handleEthereumTx} artwork={artworkData} />
  );
}

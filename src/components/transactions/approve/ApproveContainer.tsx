/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { useNextRouteCreator } from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import { getFirstValue, isValidTxHash } from 'utils/helpers';
import { getTokenId } from 'utils/products';
import { isNonUserRejectedError } from 'utils/transactions';

import { MethodEnum } from 'types/NFTMarketInterface';
import Artwork from 'types/Artwork';
import Account from 'types/Account';
import { ModalKey } from 'types/modal';

import ApproveView from './ApproveView';
import { TransactionError } from '../TransactionError';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';
import SecondaryListMissingVerification from '../secondaryList/SecondaryListMissingVerification';
import VerifySocialBlockCustomRedirect from 'components/trust-safety/VerifySocialBlockCustomRedirect';

interface ApproveContainerProps {
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
  hasSocialVerification: boolean;
  currentUserHasSocialVerification: boolean;
  artwork: Artwork;
  currentUser: Account;
}

// TODO: Confirm that this flow still works well after
// removing the formik element
export default function ApproveContainer(
  props: ApproveContainerProps
): JSX.Element {
  const {
    resetTransaction,
    isWrongNetwork,
    hasSocialVerification,
    currentUserHasSocialVerification,
    currentUser,
  } = props;

  const router = useRouter();
  const slug = getFirstValue(router?.query?.slug);

  const [isBlocked, setIsBlocked] = useState(true);

  const tokenId = getTokenId(slug);

  const { setCurrentModal } = useModal();

  // TODO: Use user route rather than creator route
  const submittedRoute = useNextRouteCreator('/approve/submitted');

  const {
    sendApproveTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.Approve });

  const handleEthereumTx = useCallback(async () => {
    if (isProviderLoading) {
      return setCurrentModal(ModalKey.AUTH_MAIN);
    }

    const txHash = await sendApproveTransaction({});

    const hasValidTxHash = isValidTxHash(txHash);

    if (hasValidTxHash) {
      await router.push({
        pathname: submittedRoute,
        query: { txHash },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId, sendApproveTransaction, router, submittedRoute]);

  if (!hasSocialVerification) {
    return <SecondaryListMissingVerification currentUser={currentUser} />;
  }

  if (!currentUserHasSocialVerification && isBlocked) {
    return (
      <VerifySocialBlockCustomRedirect handleSkip={() => setIsBlocked(false)} />
    );
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

  return <ApproveView onSubmit={handleEthereumTx} />;
}

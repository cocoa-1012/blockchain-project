import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import { useState } from 'react';
import { useEffect } from 'react';
import Sentry from 'lib/clients/sentry';
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getError } from 'utils/helpers';

export default function usePendingTransactionStatus(publicKey) {
  const [hasPendingTransactions, setHasPendingTransactions] = useState(false);
  // We would normally swap this out for a read only provider
  // But as pending transactions are tightly coupled to the provider that generated them we have kept this as the signer provider
  // TODO: Swap out for blocknatives new transactions api when live
  const { library: provider, active: providerIsActive } = useWeb3React();
  const { isWrongNetwork } = useIsWrongNetwork();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getBalanceAsync = useCallback(
    async (publicKey) => {
      try {
        setIsLoading(true);

        const pendingTransactionCount = await provider.getTransactionCount(
          publicKey,
          'pending'
        );

        const completedTransactionCount = await provider.getTransactionCount(
          publicKey,
          'latest'
        );

        if (pendingTransactionCount !== completedTransactionCount) {
          setHasPendingTransactions(true);
        }
        if (pendingTransactionCount === completedTransactionCount) {
          setHasPendingTransactions(false);
        }

        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
        Sentry.captureException(getError(err));
      }
    },
    [provider]
  );

  useEffect(() => {
    if (!providerIsActive || !provider) {
      return;
    }

    if (publicKey) {
      getBalanceAsync(publicKey);
    }
  }, [provider, publicKey, providerIsActive, getBalanceAsync]);

  if (isWrongNetwork) {
    return {
      hasPendingTransactions: false,
      isLoading: false,
      isError: true,
      refetch: async () => {
        // console.log('TODO refetch');
      },
    };
  }

  return {
    hasPendingTransactions: hasPendingTransactions,
    isLoading,
    isError,
    refetch: async () => {
      // console.log('TODO refetch');
    },
  };
}

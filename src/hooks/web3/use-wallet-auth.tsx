import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';
import { useQueryClient } from 'react-query';

import { handleWalletAuth } from 'utils/auth';
import { injectedConnector, walletConnectConnector } from 'lib/connectors';

import useLastConnector from 'hooks/web3/use-last-connector';

import Account from 'types/Account';
import { WalletState, WalletProvider } from 'types/Wallet';
import { QueryCacheKey } from 'types/Queries';

import useWalletState from 'state/stores/wallet';
import useBalance from 'hooks/queries/use-balance';
import useAuthToken from 'hooks/queries/use-auth-token';

interface WalletAuth {
  authPending: boolean;
  handleAuth: ({ provider }: { provider: WalletProvider }) => void;
  walletState: WalletState;
}

const getProvider = (provider: WalletProvider) => {
  switch (provider) {
    case WalletProvider.MetaMask:
      return injectedConnector;

    case WalletProvider.WalletConnect:
      return walletConnectConnector;
  }
};

export default function useWalletAuth(): WalletAuth {
  const { setLastConnector } = useLastConnector();
  const queryClient = useQueryClient();
  const { user } = useAuthToken();

  const {
    active: isProviderActive,
    library: provider,
    activate,
    error,
    deactivate,
  } = useWeb3React();

  const [authPending, setAuthPending] = useState<boolean>(false);
  const [hasRequestedSign, setHasRequestedSign] = useState<boolean>(false);
  const [walletType, setWalletType] = useState<WalletProvider>(null);

  const walletState = useWalletState((state) => state.walletState);
  const setWalletState = useWalletState((state) => state.setWalletState);
  const { remove: resetBalance } = useBalance();

  // If a user rejects connecting disable is loading for retries
  useEffect(() => {
    // If there is an error from a user cancelling the activate, then reset all the state was set up until that point
    if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect
    ) {
      setAuthPending(false);
      setWalletType(null);
      setHasRequestedSign(false);
    }
  }, [error, deactivate]);

  const onAuthenticated = useCallback(
    (user: Account) => {
      queryClient.setQueryData(QueryCacheKey.WalletUser, { user });

      setWalletState(WalletState.Connected);
      resetBalance();
      setLastConnector(walletType);
    },
    [setWalletState, setLastConnector, resetBalance, walletType, queryClient]
  );

  const onSignMessageError = useCallback(() => {
    setWalletState(WalletState.SignMessageError);
  }, [setWalletState]);

  const onRequestAccountsSuccess = useCallback(() => {
    setWalletState(WalletState.RequestAccountSuccess);
  }, [setWalletState]);

  const onSignMessageSuccess = useCallback(() => {
    setWalletState(WalletState.SignMessageSuccess);
  }, [setWalletState]);

  const onUnsupportedAccountType = useCallback(() => {
    setWalletState(WalletState.UnsupportedAccountType);
  }, [setWalletState]);

  useEffect(() => {
    if (
      isProviderActive &&
      hasRequestedSign &&
      walletState !== WalletState.WrongNetwork
    ) {
      const handleAuthSign = async () => {
        await handleWalletAuth({
          provider,
          onAuthenticated,
          onSignMessageError,
          onRequestAccountsSuccess,
          onSignMessageSuccess,
          onUnsupportedAccountType,
        });
        setAuthPending(false);
      };
      handleAuthSign();
      setHasRequestedSign(false);
    }
  }, [
    provider,
    hasRequestedSign,
    isProviderActive,
    onAuthenticated,
    onRequestAccountsSuccess,
    onSignMessageSuccess,
    onSignMessageError,
    onUnsupportedAccountType,
    walletState,
  ]);

  const handleAuth = async ({ provider }: { provider: WalletProvider }) => {
    setAuthPending(true);
    const connector = getProvider(provider);

    // Pulled from Uniswap codebase
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }

    await activate(connector);
    setWalletType(provider);

    // If user already hs auth token dont prompt for signing message again
    if (!user) {
      setHasRequestedSign(true);
    }
  };

  return {
    authPending,
    handleAuth,
    walletState,
  };
}

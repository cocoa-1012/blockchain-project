import { useEffect } from 'react';
import {
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
  NoEthereumProviderError,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { useWeb3React } from '@web3-react/core';

import useEagerConnect from 'hooks/web3/use-eager-connect';
import useInactiveListener from 'hooks/web3/use-inactive-listener';
import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useLastConnector from 'hooks/web3/use-last-connector';
import useAuthToken from 'hooks/queries/use-auth-token';

import { useExternalWalletLogout } from 'utils/auth';

import { WalletProvider, WalletState } from 'types/Wallet';

import useWalletState from 'state/stores/wallet';

export default function UseWeb3Manager(): void {
  const { lastConnector } = useLastConnector();
  const { user } = useAuthToken();
  const { active: isProviderActive, account, error } = useWeb3React();
  const handleLogout = useExternalWalletLogout();

  const { isWrongNetwork, isLoading: isNetworkLoading } = useIsWrongNetwork();
  const triedEager = useEagerConnect();
  useInactiveListener(
    triedEager && lastConnector.wallet === WalletProvider.MetaMask
  );

  const setWalletState = useWalletState((state) => state.setWalletState);
  const walletState = useWalletState((state) => state.walletState);

  console.log(walletState);

  const publicAddress = user?.publicAddress;

  // handle changing accounts
  useEffect(() => {
    // Note that accountsChanged is emitted on page load.
    if (!!account && !!publicAddress && account !== publicAddress) {
      handleLogout();
    }
  }, [account, publicAddress, handleLogout]);

  // handler for when we’re on the wrong network
  useEffect(() => {
    if (isProviderActive && isWrongNetwork && !isNetworkLoading && !!account) {
      setWalletState(WalletState.WrongNetwork);
    }
  }, [
    isWrongNetwork,
    isProviderActive,
    isNetworkLoading,
    account,
    setWalletState,
  ]);

  // handler for when the user switches back from the wrong network
  useEffect(() => {
    if (isProviderActive && !isWrongNetwork && !isNetworkLoading && !!account) {
      setWalletState(WalletState.Connected);
    }
  }, [
    isWrongNetwork,
    isProviderActive,
    isNetworkLoading,
    account,
    setWalletState,
  ]);

  // handler for provider level errors
  useEffect(() => {
    if (error instanceof UserRejectedRequestErrorInjected) {
      setWalletState(WalletState.RequestAccountError);
    }
    if (error instanceof UserRejectedRequestErrorWalletConnect) {
      setWalletState(WalletState.RequestAccountError);
    }
    if (error instanceof NoEthereumProviderError) {
      setWalletState(WalletState.MetaMaskNotInstalled);
    }
  }, [error, setWalletState]);
}

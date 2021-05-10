/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useEffect } from 'react';
import { always, cond, propEq } from 'ramda';
import { useRouter } from 'next/router';

import { ModalKey } from 'types/modal';
import { WalletState, WalletProvider } from 'types/Wallet';

import ModalContainer from 'components/modals/common/ModalContainer';
import ModalContent from 'components/modals/common/ModalContent';
import ModalCloseButton from 'components/modals/ModalCloseButton';
import WalletWrongNetwork from 'components/auth/WalletWrongNetwork';
import MetaMaskNotInstalled from 'components/auth/MetaMaskNotInstalled';
import WalletErrorState from 'components/auth/WalletErrorState';
import AuthConnect from 'components/auth/AuthConnect';
import AuthSign from 'components/auth/AuthSign';
import AuthUnsupportedAccount from 'components/auth/AuthUnsupportedAccount';

import useWalletAuth from 'hooks/web3/use-wallet-auth';
import useAuthToken from 'hooks/queries/use-auth-token';
import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useWeb3Manager from 'hooks/web3/use-web3-manager';
import useModal from 'hooks/use-modal';

import { isAuthenticatedRoute } from 'utils/auth';
import { sgIdentify } from 'lib/clients/analytics';

import useWalletState from 'state/stores/wallet';
import useLastConnector from 'hooks/web3/use-last-connector';
import { LastConnector } from 'state/stores/last-connector';

export default function AuthModal(): JSX.Element {
  const router = useRouter();
  const { user } = useAuthToken();
  useWeb3Manager();

  const { resetModal, currentModal, setCurrentModal } = useModal();

  const isAuthModal = currentModal === ModalKey.AUTH_MAIN;
  const { isLoading: isUserLoading } = useAuthToken();
  const { authPending, handleAuth, walletState } = useWalletAuth();
  const { lastConnector } = useLastConnector();

  const chosenProvider = cond([
    [propEq('wallet', WalletProvider.MetaMask), always('MetaMask')],
    [propEq('wallet', WalletProvider.WalletConnect), always('WalletConnect')],
  ]);

  useEffect(() => {
    if (user) {
      sgIdentify({
        userId: user.publicAddress,
        traits: {
          publicAddress: user.publicAddress,
          provider: chosenProvider(lastConnector),
        },
        options: null,
        callback: null,
      });
    }
  }, [user, lastConnector, chosenProvider]);

  useEffect(
    () => {
      if (walletState === WalletState.Connected && isAuthModal) {
        resetModal();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletState]
  );

  const isAuthRoute = isAuthenticatedRoute(router.pathname);

  useEffect(() => {
    console.log(walletState);
    if (isUserLoading || !isAuthRoute) {
      return;
    }

    const wrongNetwork = walletState === WalletState.WrongNetwork;

    if (!user || wrongNetwork) {
      setCurrentModal(ModalKey.AUTH_MAIN);
    }
  }, [
    isAuthRoute,
    walletState,
    isUserLoading,
    user,
    authPending,
    setCurrentModal,
  ]);

  return (
    <ModalContainer modalKey={ModalKey.AUTH_MAIN}>
      <ModalContent sx={{ maxWidth: 400, paddingBottom: ['l', null, 40] }}>
        <ModalCloseButton />
        <RenderAuthModal
          walletState={walletState}
          authPending={authPending}
          handleAuth={handleAuth}
          lastConnector={lastConnector}
        />
      </ModalContent>
    </ModalContainer>
  );
}

interface RenderAuthModalProps {
  walletState: WalletState;
  handleAuth: ({ provider }: { provider: WalletProvider }) => void;
  authPending: boolean;
  lastConnector: LastConnector;
}

function RenderAuthModal(props: RenderAuthModalProps): JSX.Element {
  const { walletState, handleAuth, authPending, lastConnector } = props;

  const { isWrongNetwork } = useIsWrongNetwork();
  const setWalletState = useWalletState((state) => state.setWalletState);

  const resetModal = () => setWalletState(WalletState.Disconnected);

  if (walletState === WalletState.RequestAccountError) {
    return (
      <WalletErrorState title="Account access needed" resetModal={resetModal}>
        Please give your wallet permission to view your accounts.
      </WalletErrorState>
    );
  }

  if (walletState === WalletState.SignMessageError) {
    return (
      <WalletErrorState title="Signature rejected" resetModal={resetModal}>
        Please sign the message in you wallet to continue.
      </WalletErrorState>
    );
  }

  if (isWrongNetwork) {
    return <WalletWrongNetwork />;
  }

  if (walletState === WalletState.MetaMaskNotInstalled) {
    return <MetaMaskNotInstalled />;
  }

  if (walletState === WalletState.RequestAccountSuccess) {
    return <AuthSign />;
  }

  if (walletState === WalletState.UnsupportedAccountType) {
    return <AuthUnsupportedAccount />;
  }

  return (
    <AuthConnect
      handleAuth={handleAuth}
      authPending={authPending}
      lastConnector={lastConnector}
    />
  );
}

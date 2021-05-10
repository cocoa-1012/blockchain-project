/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { any } from 'ramda';
import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import useAuthToken from 'hooks/queries/use-auth-token';

import InstagramContainer from 'components/verify/instagram/InstagramContainer';
import LoadingPage from 'components/LoadingPage';
import Page from 'components/Page';
import { PageColorMode } from 'types/page';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import { css, Global } from '@emotion/react';

export default function Instagram(): JSX.Element {
  const { user, isLoading: isUserLoading } = useAuthToken();

  const [resetKey, setResetKey] = useState<number>(Date.now());

  const { active: isWalletStateActive } = useWeb3React();

  const loadingStates = [isUserLoading, !isWalletStateActive];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <>
      <Global
        styles={css`
          body {
            background-color: #f2f2f2;
          }
        `}
      />
      <Page
        title="Verify Instagram"
        mode={PageColorMode.light}
        footerStyle={{ display: 'none' }}
      >
        <InstagramContainer
          authToken={user?.token}
          publicAddress={user?.publicAddress}
          key={resetKey}
          reset={setResetKey}
        />
      </Page>
    </>
  );
}

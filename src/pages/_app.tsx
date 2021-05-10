/* eslint-disable react/jsx-max-depth */
import React, { ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'theme-ui';
import dynamic from 'next/dynamic';
import * as Sentry from '@sentry/react';
import { ApolloProvider } from '@apollo/client';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import type { AppProps } from 'next/app';

import 'minireset.css/minireset.css';

import 'assets/css/fonts.css';
import 'assets/css/global.css';
import 'assets/css/progress.css';
import 'assets/css/tooltip.css';

import 'react-toggle/style.css';
import 'assets/css/toggle.css';

import { isProdOrStaging } from 'utils/helpers';
import { theme } from 'utils/themes/main/theme';
import { apolloClient } from 'lib/clients/apollo';
import { SENTRY_IGNORED_ERRORS } from 'lib/constants';

import AuthModal from 'components/modals/auth/AuthModal';

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

const ProgressBar = dynamic(() => import('components/TopProgressBar'), {
  ssr: false,
});

const FollowsModal = dynamic(() => import('components/modals/FollowsModal'));

Sentry.init({
  enabled: isProdOrStaging,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  release: 'fnd-frontend@' + process.env.VERCEL_GITHUB_COMMIT_SHA,
  ignoreErrors: SENTRY_IGNORED_ERRORS,
});

type AppPropsComponent = AppProps['Component'];

type ComponentExtension = {
  getLayout: (page: ReactNode, props: unknown) => ReactNode;
};

type CustomComponent = ComponentExtension & AppPropsComponent;

type CustomAppProps = {
  err: any;
  Component: CustomComponent;
  pageProps: AppProps['pageProps'];
};

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps,
  err,
}: CustomAppProps): JSX.Element {
  // https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  useEffect(() => {
    if (window.analytics) {
      window.analytics.page();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ProgressBar />
          <ThemeProvider theme={theme}>
            <>
              <AuthModal />
              <FollowsModal />
              <div id="portal" />
              {getLayout(<Component {...pageProps} err={err} />, pageProps)}
            </>
          </ThemeProvider>
        </Web3ReactProvider>
      </ApolloProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

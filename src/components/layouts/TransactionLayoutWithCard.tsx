/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject } from 'theme-ui';
import { ReactNode } from 'react';
import { Global, css } from '@emotion/react';
import { useRouter } from 'next/router';

import useArtworkByTokenId from 'hooks/queries/use-artwork-by-token-id';
import useNavigationProgress from 'hooks/use-navigation-progress';

import Page from 'components/Page';
import TransactionNavigation from 'components/transactions/TransactionNavigation';
import TransactionContainer from 'components/transactions/TransactionContainer';

import { PageTypes } from 'types/page';
import { CardVariant } from 'types/Card';
import Artwork from 'types/Artwork';
import { NavigationStep } from 'types/NavigationStep';

import { getFirstValue, notEmptyOrNil } from 'utils/helpers';
import { getTokenId } from 'utils/products';

const styles = css`
  body {
    background-color: #f2f2f2;
  }
  .tab-navigation {
    display: none;
  }
`;

type PageTitleBuilder = (arg0: Artwork) => string;

interface TransactionLayoutWithCardProps {
  children: ReactNode;
  title: string;
  buildTitle?: PageTitleBuilder;
  percentCompleted: number;
  navigationSteps: NavigationStep[];
}

export default function TransactionLayoutWithCard(
  props: TransactionLayoutWithCardProps
): JSX.Element {
  const { children, title, buildTitle, percentCompleted, navigationSteps } =
    props;

  const router = useRouter();

  const sx = getStyles();

  const tokenSlug = getFirstValue(router.query.slug);
  const tokenId = getTokenId(tokenSlug);

  const hasNavigation = notEmptyOrNil(navigationSteps);

  const { data: artworkData } = useArtworkByTokenId({ tokenId });

  useNavigationProgress({ percentCompleted });

  return (
    <>
      <Global styles={styles} />
      <Page
        type={PageTypes.auth}
        title={buildTitle ? buildTitle(artworkData) : title}
      >
        {hasNavigation && (
          <TransactionNavigation
            sx={sx.navigation}
            navigationSteps={navigationSteps}
          />
        )}
        <TransactionContainer
          artwork={artworkData}
          cardVariant={CardVariant.default}
        >
          {children}
        </TransactionContainer>
      </Page>
    </>
  );
}

interface WrappedTransactionLayoutWithCardProps {
  title: string;
  buildTitle?: PageTitleBuilder;
  percentCompleted?: number;
  navigationSteps?: NavigationStep[];
}

export function WrappedTransactionLayoutWithCard(
  props: WrappedTransactionLayoutWithCardProps
): (arg0: JSX.Element, arg1: TransactionLayoutWithCardProps) => JSX.Element {
  const { title, buildTitle, percentCompleted, navigationSteps } = props;
  return function RenderWrappedTransactionLayout(
    page: JSX.Element,
    props: TransactionLayoutWithCardProps
  ): JSX.Element {
    return (
      <TransactionLayoutWithCard
        {...props}
        title={title}
        buildTitle={buildTitle}
        percentCompleted={percentCompleted}
        navigationSteps={navigationSteps}
      >
        {page}
      </TransactionLayoutWithCard>
    );
  };
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    flexDirection: 'column',
    flex: 'auto',
    paddingTop: ['xl', 'xxxl'],
    paddingBottom: ['xl', 'xxxxl'],
  };
  const navigation: ThemeUIStyleObject = {
    paddingTop: ['m', null, 'l', 'xl'],
  };
  return { container, navigation };
};

/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { ReactNode } from 'react';
import { Global, css } from '@emotion/react';

import TransactionNavigation from 'components/transactions/TransactionNavigation';
import Page from 'components/Page';

import { PageTypes } from 'types/page';
import { flexDirectionForPrefix } from 'types/styles';
import { NavigationStep } from 'types/NavigationStep';

import useBodyClass from 'hooks/use-body-class';
import useNavigationProgress from 'hooks/use-navigation-progress';
import { notEmptyOrNil } from 'utils/helpers';

interface MintAndListLayoutProps {
  children: ReactNode;
  title: string;
  percentCompleted: number;
  navigationSteps?: NavigationStep[];
  bodyClass: string;
}

export default function TransactionLayout(
  props: MintAndListLayoutProps
): JSX.Element {
  const { children, title, percentCompleted, navigationSteps, bodyClass } =
    props;

  const hasNavigation = notEmptyOrNil(navigationSteps);

  useNavigationProgress({ percentCompleted });

  useBodyClass(bodyClass);

  const styles = css`
    body {
      background-color: #f2f2f2;
    }
  `;

  const sx = {
    container: {
      flexDirection: flexDirectionForPrefix,
      flex: 'auto',
      paddingTop: 'xxxl',
      paddingBottom: 'xxxxl',
    },
  };

  return (
    <>
      <Global styles={styles} />
      <Page type={PageTypes.auth} title={title}>
        {hasNavigation && (
          <TransactionNavigation
            navigationSteps={navigationSteps}
            sx={{ paddingTop: ['m', null, 'l', 'xl'] }}
          />
        )}
        <Flex sx={sx.container}>{children}</Flex>
      </Page>
    </>
  );
}

interface WrappedTransactionLayoutProps {
  title: string;
  percentCompleted?: number;
  navigationSteps?: NavigationStep[];
  bodyClass?: string;
}

export function WrappedTransactionLayout(
  props: WrappedTransactionLayoutProps
): (arg0: JSX.Element, arg1: MintAndListLayoutProps) => JSX.Element {
  const {
    title,
    percentCompleted,
    navigationSteps,
    bodyClass = 'transaction-layout',
  } = props;

  return function RenderWrappedTransactionLayout(
    page: JSX.Element,
    props: MintAndListLayoutProps
  ): JSX.Element {
    return (
      <TransactionLayout
        {...props}
        title={title}
        percentCompleted={percentCompleted}
        navigationSteps={navigationSteps}
        bodyClass={bodyClass}
      >
        {page}
      </TransactionLayout>
    );
  };
}

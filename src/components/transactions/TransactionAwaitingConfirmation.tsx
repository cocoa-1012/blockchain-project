/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';
import { Global, css } from '@emotion/react';

import SpinnerStroked from 'components/SpinnerStroked';
import TransactionContent from './TransactionContent';

export default function TransactionAwaitingConfirmation(): JSX.Element {
  return (
    <>
      <Global
        styles={css`
          .header-inner {
            margin-bottom: 0;
          }
        `}
      />
      <TransactionContent
        title="Waiting for confirmation…"
        description={
          <Box sx={{ maxWidth: 260 }}>
            Confirm this transaction in your wallet to continue.
          </Box>
        }
      >
        <Flex sx={{ marginX: ['auto', null, 0] }}>
          <SpinnerStroked size={62} />
        </Flex>
      </TransactionContent>
    </>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import TransactionContent from '../TransactionContent';

import { BurnTransactionProps } from 'components/transactions/burn/types';
import {
  mobileAlignCenter,
  transactionButton,
} from 'components/transactions/styles';

interface BurnTransactionSuccessProps extends BurnTransactionProps {
  status: string;
  isBurnedOnSubgraph: boolean;
  profilePath: string;
}

export default function BurnTransactionSuccess(
  props: BurnTransactionSuccessProps
): JSX.Element {
  const { txHash, isBurnedOnSubgraph, profilePath } = props;

  const isBurned = isBurnedOnSubgraph;

  return (
    <TransactionContent
      title="This NFT has been burned."
      description="This NFT has been successfully burned, and it will no longer be displayed on Foundation."
    >
      <Box sx={transactionButton}>
        <TransactionSuccessLink
          href={`${profilePath}`}
          isLoading={!isBurned}
          variant="primary"
        >
          Back to profile
        </TransactionSuccessLink>
      </Box>

      <Flex sx={mobileAlignCenter}>
        <TransactionHashLink txHash={txHash} />
      </Flex>
    </TransactionContent>
  );
}

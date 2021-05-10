/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex, Box } from 'theme-ui';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import TransactionContent from '../TransactionContent';

import { ApproveTransactionProps } from 'components/transactions/approve/types';
import { mobileAlignCenter } from 'components/transactions/styles';

interface ApproveTransactionSuccessProps extends ApproveTransactionProps {
  artworkPath: string;
  status: string;
  isEventEmitted: boolean;
}

export default function ApproveTransactionSuccess(
  props: ApproveTransactionSuccessProps
): JSX.Element {
  const { txHash, artworkPath, isEventEmitted } = props;

  const isPriceChanged = isEventEmitted;

  return (
    <TransactionContent
      title={<Box sx={{ width: 420 }}>The auction contract is approved!</Box>}
      description={
        <Box sx={{ maxWidth: 360 }}>
          You have successfully given the Foundation auction contract approval
          to list your NFTs for sale. You’re now free to list your NFTs in the
          secondary market.
        </Box>
      }
    >
      <Grid gap="l">
        <Box sx={{ maxWidth: [null, null, 260] }}>
          <TransactionSuccessLink
            href={`${artworkPath}/list`}
            isLoading={!isPriceChanged}
            variant="primary"
          >
            List NFT
          </TransactionSuccessLink>
        </Box>

        <Flex sx={mobileAlignCenter}>
          <TransactionHashLink txHash={txHash} />
        </Flex>
      </Grid>
    </TransactionContent>
  );
}

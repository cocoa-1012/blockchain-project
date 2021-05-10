/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import TransactionContent from '../TransactionContent';

import { TransferTransactionProps } from 'components/transactions/transfer/types';
import { mobileAlignCenter } from 'components/transactions/styles';

interface TransferTransactionSuccessProps extends TransferTransactionProps {
  artworkPath: string;
  status: string;
}

export default function TransferTransactionSuccess(
  props: TransferTransactionSuccessProps
): JSX.Element {
  const { txHash, artworkPath } = props;

  return (
    <TransactionContent
      title="This NFT has been transferred."
      description="This NFT has been successfully transferred to the new owner."
    >
      <Box sx={{ maxWidth: [null, null, 200] }}>
        <TransactionSuccessLink href={artworkPath} variant="primary">
          View artwork
        </TransactionSuccessLink>
      </Box>

      <Flex sx={mobileAlignCenter}>
        <TransactionHashLink txHash={txHash} />
      </Flex>
    </TransactionContent>
  );
}

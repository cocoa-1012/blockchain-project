/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex } from 'theme-ui';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import TransactionContent from '../TransactionContent';

import { mobileAlignCenter } from 'components/transactions/styles';

interface UnlistTransactionSuccessProps {
  profilePath: string;
  status: string;
  isEventEmitted: boolean;
  txHash: string;
}

export default function UnlistTransactionSuccess(
  props: UnlistTransactionSuccessProps
): JSX.Element {
  const { txHash, isEventEmitted, profilePath } = props;

  const isPriceChanged = isEventEmitted;

  return (
    <TransactionContent
      title="This NFT has been unlisted."
      description="The artwork has been successfully unlisted from Foundation."
    >
      <Box>
        <TransactionSuccessLink
          href={profilePath}
          isLoading={!isPriceChanged}
          variant="primary"
        >
          View profile
        </TransactionSuccessLink>
      </Box>

      <Flex sx={mobileAlignCenter}>
        <TransactionHashLink txHash={txHash} />
      </Flex>
    </TransactionContent>
  );
}

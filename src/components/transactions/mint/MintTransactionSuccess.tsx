/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex } from 'theme-ui';

import TransactionContainer from 'components/transactions/TransactionContainer';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import ConfettiCanvas from 'components/ConfettiCanvas';
import TransactionContent from '../TransactionContent';

import { TagArtworkPath, MintTransactionProps } from './types';

import {
  mobileAlignCenter,
  transactionButton,
} from 'components/transactions/styles';

import useNavigationProgress from 'hooks/use-navigation-progress';

interface MintTransactionSuccessProps extends MintTransactionProps {
  tokenId?: string;
  tagArtworkPath: string | TagArtworkPath;
  isEventEmitted?: boolean;
}

export default function MintTransactionSuccess(
  props: MintTransactionSuccessProps
): JSX.Element {
  const { artwork, txHash, tagArtworkPath, tokenId, isEventEmitted } = props;

  useNavigationProgress({
    percentCompleted: 50,
  });

  return (
    <>
      <ConfettiCanvas fireConfetti={Boolean(tokenId) || isEventEmitted} />
      <TransactionContainer artwork={artwork}>
        <TransactionContent
          title="Your NFT has been minted!"
          description="Congratulations! Your artwork has officially been minted as an NFT on the Ethereum blockchain."
        >
          <Grid gap="l" sx={transactionButton}>
            <TransactionSuccessLink
              isLoading={false}
              variant="primary"
              href={tagArtworkPath}
            >
              Continue
            </TransactionSuccessLink>
            <Flex sx={mobileAlignCenter}>
              <TransactionHashLink txHash={txHash} />
            </Flex>
          </Grid>
        </TransactionContent>
      </TransactionContainer>
    </>
  );
}

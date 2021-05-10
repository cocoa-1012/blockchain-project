/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Grid, Flex, Text } from 'theme-ui';

import TransactionContainer from 'components/transactions/TransactionContainer';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import ConfettiCanvas from 'components/ConfettiCanvas';
import TwitterShareButtonLink from 'components/links/TwitterShareButtonLink';
import { SecondaryListTransactionProps } from 'components/transactions/secondaryList/types';

import { buildSecondaryListTweet } from 'utils/twitter-templates';
import { CardVariant } from 'types/Card';
import { mobileAlignCenter } from 'components/transactions/styles';

interface SecondaryListTransactionSuccessProps
  extends SecondaryListTransactionProps {
  artworkPath: string;
  status: string;
  isListedOnSubgraph: boolean;
  twitterUsername: string;
}

export default function SecondaryListTransactionSuccess(
  props: SecondaryListTransactionSuccessProps
): JSX.Element {
  const {
    artwork,
    txHash,
    status,
    artworkPath,
    isListedOnSubgraph,
    twitterUsername,
  } = props;

  const isListed = isListedOnSubgraph;

  const twitterShareText = buildSecondaryListTweet({
    artworkName: artwork?.name,
    artworkPath,
    twitterUsername,
  });

  // TODO: Decide if this should be shared with ListTransactionSuccess for primary auctions

  return (
    <>
      <ConfettiCanvas fireConfetti={isListed} />
      <TransactionContainer artwork={artwork} cardVariant={CardVariant.default}>
        <Heading variant="h.xl" sx={{ marginBottom: 'm' }}>
          Your NFT has been listed!
        </Heading>
        <Text variant="body.body" sx={{ maxWidth: 280, marginBottom: 'l' }}>
          Your NFT has been successfully listed on our marketplace.
        </Text>

        <Grid gap="l">
          <Grid columns={[1, 2]} gap={10}>
            <TwitterShareButtonLink twitterShareText={twitterShareText} />
            <TransactionSuccessLink
              href={artworkPath}
              isLoading={!isListed}
              variant="outline"
            >
              View NFT
            </TransactionSuccessLink>
          </Grid>

          <Flex sx={mobileAlignCenter}>
            <TransactionHashLink txHash={txHash} />
          </Flex>
        </Grid>
      </TransactionContainer>
    </>
  );
}

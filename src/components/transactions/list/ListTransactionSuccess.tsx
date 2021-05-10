/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Grid, Flex, Text } from 'theme-ui';
import { useEffect } from 'react';

import TransactionContainer from 'components/transactions/TransactionContainer';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';
import ConfettiCanvas from 'components/ConfettiCanvas';
import TwitterShareButtonLink from 'components/links/TwitterShareButtonLink';
import { ListTransactionProps } from 'components/transactions/list/types';

import { buildListTweet } from 'utils/twitter-templates';
import { mobileAlignCenter } from 'components/transactions/styles';

import useNavigationFlow from 'state/stores/navigation-flow';

interface ListTransactionSuccessProps extends ListTransactionProps {
  artworkPath: string;
  status: string;
  isListedOnSubgraph: boolean;
}

export default function ListTransactionSuccess(
  props: ListTransactionSuccessProps
): JSX.Element {
  const { artwork, txHash, artworkPath, isListedOnSubgraph } = props;

  const isListed = isListedOnSubgraph;

  const setPercentCompleted = useNavigationFlow(
    (state) => state.setPercentCompleted
  );

  const twitterShareText = buildListTweet({
    artworkName: artwork?.name,
    artworkPath,
  });

  useEffect(() => {
    if (isListed) {
      setPercentCompleted(100);
    }
  }, [isListed, setPercentCompleted]);

  return (
    <>
      <ConfettiCanvas fireConfetti={isListed} />
      <TransactionContainer artwork={artwork}>
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

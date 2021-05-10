/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Heading, Flex, Text } from 'theme-ui';

import SpinnerStroked from 'components/SpinnerStroked';
import ArtworkCardMinimal from 'components/cards/artwork/ArtworkCardMinimal';
import { TransactionFormContainer } from '../TransactionContainer';

import { MintTransactionProps } from './types';
import { textAlignCenter } from 'types/styles';

import useNavigationProgress from 'hooks/use-navigation-progress';

export default function MintMetadataSyncing(
  props: MintTransactionProps
): JSX.Element {
  const { artwork } = props;

  useNavigationProgress({
    percentCompleted: 50,
  });

  const sx = getStyles();

  return (
    <TransactionFormContainer>
      <Grid columns="340px auto" gap="l">
        <Box>
          <ArtworkCardMinimal artwork={artwork} creator={artwork?.creator} />
        </Box>
        <Box sx={sx.container}>
          <Box>
            <Flex sx={sx.spinner}>
              <SpinnerStroked size={62} />
            </Flex>
            <Box sx={{ maxWidth: 360, marginX: 'auto' }}>
              <Heading variant="h.m" sx={sx.heading}>
                The metadata of your NFT is syncing…
              </Heading>
              <Text variant="body.body" sx={sx.text}>
                Your NFT has been successfully minted, and is now being synced
                with our servers. You will be able to list your NFT on
                Foundation soon.
              </Text>
            </Box>
          </Box>
        </Box>
      </Grid>
    </TransactionFormContainer>
  );
}

const getStyles = () => ({
  container: {
    paddingY: 'xxl',
    boxShadow: 's',
    borderRadius: 10,
    backgroundColor: 'white.100',
    padding: 'l',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: { marginBottom: 'l', justifyContent: 'center' },
  heading: { marginBottom: 'm', textAlign: textAlignCenter },
  text: { textAlign: textAlignCenter },
});

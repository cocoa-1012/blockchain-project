/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Grid, Box, Heading, Text } from 'theme-ui';

import { TransactionFormContainer } from '../TransactionContainer';
import ListForm from 'components/transactions/secondaryList/SecondaryListForm';
import ArtworkCardFormik from 'components/cards/artwork/ArtworkCardFormik';
import ETHField from 'components/forms/fields/ETHField';
import ETHinUSDField from 'components/forms/fields/ETHinUSDField';
import ExternalLink from 'components/links/ExternalLink';
import ValidatedSubmitButton from 'components/forms/ValidatedSubmitButton';

import { SecondaryListFormValues } from './types';
import Artwork from 'types/Artwork';
import { ArtworkCard } from 'components/cards/artwork/ArtworkCard';

interface ListViewProps {
  onSubmit: (values: SecondaryListFormValues) => void;
  artwork: Artwork;
}

export default function ListView(props: ListViewProps): JSX.Element {
  const { onSubmit, artwork } = props;

  const sx = getStyles();

  return (
    <TransactionFormContainer>
      <ListForm
        onSubmit={onSubmit}
        initialValues={{
          price: '',
        }}
      >
        <Grid columns="340px auto" gap="l">
          <Box>
            <ArtworkCard
              artwork={artwork}
              creator={artwork.creator}
              mostRecentActiveAuction={artwork.mostRecentActiveAuction}
            />
          </Box>

          <Box sx={sx.form}>
            <Box sx={{ paddingX: 'xxl', marginBottom: 'xl' }}>
              <Heading variant="h.l" sx={{ marginBottom: 'l' }}>
                List your NFT
              </Heading>
              <Text variant="body.body" sx={{ maxWidth: 320 }}>
                List an NFT you’ve collected on Foundation for sale in our
                secondary market.
              </Text>
              <Heading
                variant="h.s"
                sx={{ marginTop: 'xl', marginBottom: 'l' }}
              >
                Set a reserve price
              </Heading>

              <Grid gap="s">
                <Grid gap="m" sx={{ maxWidth: 410 }}>
                  <ETHField placeholder="1" name="price" />
                  <Text variant="h.xs" sx={{ color: 'black.60' }}>
                    <ETHinUSDField name="price" />
                  </Text>
                </Grid>
                <Flex>
                  <ExternalLink
                    href="https://help.foundation.app/en/collections/2935762-a-complete-guide-to-the-secondary-market"
                    variant="h.body"
                    sx={{ color: 'black.60' }}
                  >
                    Learn how our auctions work.
                  </ExternalLink>
                </Flex>
              </Grid>
            </Box>
            <Grid
              columns={2}
              gap="l"
              sx={{
                paddingX: 'xxl',
              }}
            >
              <Box>
                <Text variant="body.body" sx={{ color: 'black.60' }}>
                  A 10% creator royalty will be charged based on the final sale
                  price of the artwork, and sent to the original creator.
                </Text>
              </Box>
              <Box>
                <Text variant="body.body" sx={{ color: 'black.60' }}>
                  A 5% service fee will be charged based on the final sale price
                  of the artwork.
                </Text>
              </Box>
            </Grid>
            <Box
              sx={{
                paddingX: 'xxl',
                paddingTop: 'l',
              }}
            >
              <ValidatedSubmitButton name="price" sx={{ width: '100%' }}>
                List your NFT
              </ValidatedSubmitButton>
            </Box>
          </Box>
        </Grid>
      </ListForm>
    </TransactionFormContainer>
  );
}

const getStyles = () => ({
  form: {
    paddingY: 'xxl',
    boxShadow: 's',
    borderRadius: 10,
    backgroundColor: 'white.100',
  },
});

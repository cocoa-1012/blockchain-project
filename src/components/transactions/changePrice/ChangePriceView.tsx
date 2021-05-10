/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Grid, Box, Heading, Text } from 'theme-ui';
import { Global, css } from '@emotion/react';

import ChangePriceForm from 'components/transactions/changePrice/ChangePriceForm';
import SubmitButton from 'components/forms/SubmitButton';
import ETHField from 'components/forms/fields/ETHField';
import ETHinUSDField from 'components/forms/fields/ETHinUSDField';
import ExternalLink from 'components/links/ExternalLink';

import { ChangePriceFormValues } from './types';
import Artwork from 'types/Artwork';

interface ChangePriceViewProps {
  onSubmit: (values: ChangePriceFormValues) => void;
  artwork: Artwork;
}

export default function ChangePriceView(
  props: ChangePriceViewProps
): JSX.Element {
  const { onSubmit, artwork } = props;

  const sx = getStyles();

  return (
    <>
      <Global
        styles={css`
          .transaction-container {
            grid-gap: 48px;
            grid-template-columns: 340px 540px;
          }
        `}
      />
      <ChangePriceForm
        onSubmit={onSubmit}
        initialValues={{
          price: '',
          name: artwork?.name,
        }}
      >
        <Box sx={sx.form}>
          <Box sx={{ paddingX: 'xxl', marginBottom: 'xl' }}>
            <Heading variant="h.m" sx={{ marginBottom: 'l' }}>
              Change reserve price
            </Heading>
            <Grid gap="m" sx={{ maxWidth: 410 }}>
              <ETHField placeholder="1" name="price" />
              <Text variant="h.xs" sx={{ color: 'black.60' }}>
                <ETHinUSDField name="price" />
              </Text>
            </Grid>
            <Text
              variant="body.body"
              sx={{ marginBottom: 'm', maxWidth: 440, paddingTop: 'm' }}
            >
              This price will be made public. Bidders will not be able to bid
              below this price. Once a bid has been placed, a 24 hour auction
              for the piece will begin.
            </Text>
            <Flex sx={{ marginBottom: 'xl' }}>
              <ExternalLink
                href="https://help.foundation.app/en/articles/4742888-a-complete-guide-to-listing-an-nft-for-auction"
                variant="h.body"
                sx={{ color: 'black.60' }}
              >
                Learn how our auctions work.
              </ExternalLink>
            </Flex>
          </Box>
          <Box
            sx={{
              paddingX: 'xxl',
              paddingTop: 's',
            }}
          >
            <SubmitButton disableIfInvalid sx={{ width: '100%' }}>
              Change reserve price
            </SubmitButton>
          </Box>
        </Box>
      </ChangePriceForm>
    </>
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

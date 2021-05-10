/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Grid, Text } from 'theme-ui';

import BidLearnLink from './BidLearnLink';

import { mobileAlignCenter } from 'components/transactions/styles';

export default function BidStartNotice(): JSX.Element {
  return (
    <Grid gap={10}>
      <Text variant="body.body">
        Placing this bid will start a 24 hour auction for the artwork. Once a
        bid is placed, it cannot be withdrawn.
      </Text>
      <Flex sx={mobileAlignCenter}>
        <BidLearnLink />
      </Flex>
    </Grid>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Grid, Text } from 'theme-ui';

import BidLearnLink from './BidLearnLink';

import { mobileAlignCenter } from 'components/transactions/styles';

export default function BidNotice(): JSX.Element {
  return (
    <Grid gap={10}>
      <Text variant="body.body">
        Once a bid is placed, it cannot be withdrawn.
      </Text>
      <Flex sx={mobileAlignCenter}>
        <BidLearnLink />
      </Flex>
    </Grid>
  );
}

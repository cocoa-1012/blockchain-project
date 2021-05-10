/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Flex, Text } from 'theme-ui';

import { truncateAddress } from 'utils/helpers';

interface ConnectedToWalletProps {
  publicAddress: string;
}

export default function ConnectedToWallet(
  props: ConnectedToWalletProps
): JSX.Element {
  const { publicAddress } = props;
  return (
    <Grid gap="xs" sx={{ justifyContent: 'flex-start' }}>
      <Text variant="h.body" sx={{ color: 'black.50' }}>
        Connected to
      </Text>
      <ConnectedToWalletPill publicAddress={publicAddress} />
    </Grid>
  );
}

interface ConnectedToWalletPillProps {
  publicAddress: string;
}

export function ConnectedToWalletPill(
  props: ConnectedToWalletPillProps
): JSX.Element {
  const { publicAddress } = props;

  return (
    <Flex
      sx={{
        boxShadow: 's',
        borderRadius: 999,
        paddingX: 13,
        paddingY: 9,
        backgroundColor: 'white.100',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: 14,
          height: 14,
          backgroundColor: 'green.utility',
          borderRadius: 9999,
          marginRight: 'xs',
        }}
      />
      <Text variant="mono.sub">
        {truncateAddress({ address: publicAddress, numberOfChars: 4 })}
      </Text>
    </Flex>
  );
}

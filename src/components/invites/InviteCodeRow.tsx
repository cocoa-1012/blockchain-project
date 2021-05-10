/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Grid, Box, Text } from 'theme-ui';

import InviteCode from 'types/InviteCode';

import InviteCodeCopyButton from './InviteCodeCopyButton';

interface InviteCodeRowProps {
  inviteCode: InviteCode;
  className?: string;
}

export default function InviteCodeRow(props: InviteCodeRowProps): JSX.Element {
  const { inviteCode, className } = props;

  const isDisabled = Boolean(inviteCode?.redeemedAt);

  return (
    <Flex
      className={className}
      style={{
        opacity: isDisabled ? 0.3 : 1,
        pointerEvents: isDisabled ? 'none' : 'all',
      }}
      sx={{
        boxShadow: 's',
        paddingLeft: ['m', 'l'],
        paddingRight: ['s', 'm'],
        paddingY: ['s', 'm'],
        borderRadius: 10,
        justifyContent: [null, 'space-between'],
        backgroundColor: 'white.100',
        display: ['grid', 'flex'],
        gap: ['s', 0],
      }}
    >
      <Grid gap="xs">
        <Text variant="stnd.body">Invite Code</Text>
        <Text variant="mono.body">{inviteCode.inviteCode}</Text>
      </Grid>
      <Box>
        <InviteCodeCopyButton
          isDisabled={isDisabled}
          inviteCode={inviteCode?.inviteCode}
        />
      </Box>
    </Flex>
  );
}

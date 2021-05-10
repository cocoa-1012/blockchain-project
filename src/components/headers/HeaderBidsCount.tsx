/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box, Text } from 'theme-ui';
import { transitions } from 'utils/themes/main/theme';

interface HeaderBidsCountProps {
  count: number;
}

export default function HeaderBidsCount(
  props: HeaderBidsCountProps
): JSX.Element {
  const { count } = props;
  return (
    <Grid sx={{ marginLeft: 14 }}>
      <Box
        className="number-bg"
        sx={{
          transition: transitions.smooth.fast,
          borderRadius: 999,
          overflow: 'hidden',
          backgroundColor: 'currentColor',
          gridRow: 1,
          gridColumn: 1,
          opacity: 0.1,
        }}
      />
      <Text
        variant="h.xs"
        sx={{
          // make the counter font smaller when it’s over 100
          fontSize: count > 100 ? 'body' : 'xs',
          display: 'flex',
          gridRow: 1,
          gridColumn: 1,
          minWidth: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          paddingX: 6,
          top: -1,
        }}
      >
        {count}
      </Text>
    </Grid>
  );
}

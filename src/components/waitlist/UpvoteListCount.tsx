/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text } from 'theme-ui';
import { formatNumber } from 'utils/formatters';

interface UplistVoteCountProps {
  totalUserCount: number;
}

export default function UplistVoteCount(
  props: UplistVoteCountProps
): JSX.Element {
  const { totalUserCount } = props;
  return (
    <Grid sx={{ gap: 's', textAlign: 'center' }}>
      <Text variant="h.xs" sx={{ color: 'black.60' }}>
        Current number of profiles on the Community Upvote:
      </Text>
      <Text variant="h.l">{formatNumber(totalUserCount)}</Text>
    </Grid>
  );
}

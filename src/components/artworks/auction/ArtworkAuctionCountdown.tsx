/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Text } from 'theme-ui';
import { length, cond, T } from 'ramda';

import { whenMinsLessThan } from 'utils/dates/dates';
import useCountdown from 'hooks/use-countdown';

import { ArtworkAuctionBidActionProps } from './types';
import ArtworkAuctionInfoHeading from './ArtworkAuctionInfoHeading';

export const renderArtworkAuctionCountdown = cond<any, JSX.Element>([
  [
    (auction: ArtworkAuctionBidActionProps) => whenMinsLessThan(2, auction),
    ArtworkAuctionFinalTwoMins,
  ],
  [
    (auction: ArtworkAuctionBidActionProps) => whenMinsLessThan(15, auction),
    ArtworkAuctionFinalFifteenMins,
  ],
  [T, ArtworkAuctionCountdown],
]);

function ArtworkAuctionFinalFifteenMins(props: ArtworkAuctionBidActionProps) {
  const { endDate } = props;
  return (
    <Grid sx={{ position: 'relative', top: -4 }}>
      <Text variant="h.s" sx={{ marginBottom: 'xs' }}>
        This auction is ending soon!
      </Text>
      <Box sx={{ marginBottom: 's' }}>
        <ArtworkAuctionCountdownTimer timestamp={endDate} />
      </Box>
      <Text variant="body.body">
        Any bids placed in the last 15 minutes will extend the auction for
        another 15 minutes.
      </Text>
    </Grid>
  );
}

function ArtworkAuctionFinalTwoMins() {
  return (
    <Grid sx={{ position: 'relative', top: -4 }}>
      <Text variant="h.s" sx={{ marginBottom: 'xs' }}>
        This auction is ending very soon!
      </Text>
      <Text variant="body.body">
        If you were to place a bid at this time there is a high chance that it
        would result in an error.
      </Text>
    </Grid>
  );
}

export default function ArtworkAuctionCountdown(
  props: ArtworkAuctionBidActionProps
): JSX.Element {
  const { endDate } = props;

  return (
    <Box>
      <Text variant="h.body" sx={{ marginBottom: 5 }}>
        Auction ending in
      </Text>
      <ArtworkAuctionCountdownTimer timestamp={endDate} />
    </Box>
  );
}

interface ArtworkAuctionCountdownTimerProps {
  timestamp: string;
  className?: string;
}

export function ArtworkAuctionCountdownTimer(
  props: ArtworkAuctionCountdownTimerProps
): JSX.Element {
  const { timestamp, className } = props;

  const { countdownParts, hasEnded } = useCountdown(timestamp);

  if (hasEnded) {
    return (
      <Box className={className}>
        <ArtworkAuctionInfoHeading>—</ArtworkAuctionInfoHeading>
        <Text variant="h.xs" sx={{ color: 'black.60' }}>
          Auction has ended
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      gap="s"
      columns={`repeat(${length(countdownParts)}, 65px)`}
      className={className}
    >
      {countdownParts.map((part, key) => (
        <Box key={key}>
          <ArtworkAuctionInfoHeading>{part.value}</ArtworkAuctionInfoHeading>
          <Text variant="h.body" sx={{ color: 'black.60' }}>
            {part.label}
          </Text>
        </Box>
      ))}
    </Grid>
  );
}

export function ArtworkAuctionCountdownTimerBids(
  props: ArtworkAuctionCountdownTimerProps
): JSX.Element {
  const { timestamp, className } = props;

  const { countdownParts, hasEnded } = useCountdown(timestamp);

  if (hasEnded) {
    return (
      <Box className={className}>
        <ArtworkAuctionInfoHeading>—</ArtworkAuctionInfoHeading>
        <Text variant="h.xs" sx={{ color: 'black.60' }}>
          Auction has ended
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      gap="s"
      columns={`repeat(${length(countdownParts)}, 65px)`}
      className={className}
    >
      {countdownParts.map((part, key) => (
        <Box key={key}>
          <ArtworkAuctionInfoHeading>{part.value}</ArtworkAuctionInfoHeading>
          <Text variant="h.body" sx={{ color: 'black.60' }}>
            {part.label}
          </Text>
        </Box>
      ))}
    </Grid>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text, Flex, Button } from 'theme-ui';
import { cond, always, equals, curry, compose, prop, T } from 'ramda';

import { whenMinsLessThan } from 'utils/dates/dates';

import SuccessIcon from 'assets/icons/tx-success.svg';
import ErrorIcon from 'assets/icons/error-icon.svg';
import Link from 'components/links/Link';

const bidStatusEquals = curry((status: string, data: BidStatusProps) =>
  compose(equals(status), prop('status'))(data)
);

interface BidStatusProps {
  status: string;
  minutesRemaining: number;
  bidPath: string;
}

// conditionally render outbid status when <2 minutes remaining
export const renderOutbidBidStatus = cond<BidStatusProps, JSX.Element>([
  [
    (bid: BidStatusProps) => whenMinsLessThan(2, bid),
    OutbidBidStatusWithWarning,
  ],
  [T, OutbidBidStatus],
]);

// conditionally render bid info based on status
export const renderBidStatus = cond<BidStatusProps, JSX.Element>([
  [(bid: BidStatusProps) => bidStatusEquals('Highest', bid), HighestBidStatus],
  [
    (bid: BidStatusProps) => bidStatusEquals('Outbid', bid),
    renderOutbidBidStatus,
  ],
  [T, always(null)],
]);

function HighestBidStatus() {
  return (
    <Flex sx={{ alignItems: 'center', color: 'green.utility' }}>
      <Text
        variant="h.s"
        sx={{ marginRight: 'l', maxWidth: 180, textAlign: 'right' }}
      >
        You’re the highest bidder!
      </Text>
      <SuccessIcon width={42} height={42} sx={{ display: 'block' }} />
    </Flex>
  );
}

function OutbidBidStatusWithWarning(props: BidStatusProps) {
  const { bidPath } = props;
  return (
    <Grid gap="s">
      <OutbidIconLabel />
      <Link href={bidPath}>
        <a sx={{ display: 'block', textDecoration: 'none' }}>
          <Button variant="outline">I understand, let me bid again</Button>
        </a>
      </Link>
    </Grid>
  );
}

function OutbidBidStatus(props: BidStatusProps) {
  const { bidPath } = props;
  return (
    <Grid gap="s">
      <OutbidIconLabel />
      <Link href={bidPath}>
        <a sx={{ display: 'block', textDecoration: 'none' }}>
          <Button sx={{ minWidth: 240 }}>Bid again</Button>
        </a>
      </Link>
    </Grid>
  );
}

function OutbidIconLabel() {
  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: 'red.100',
      }}
    >
      <Text variant="h.xs" sx={{ marginRight: 's' }}>
        Outbid
      </Text>
      <ErrorIcon width={26} height={26} sx={{ display: 'block' }} />
    </Flex>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Button } from 'theme-ui';
import { ReactNode } from 'react';
import { cond, T, always } from 'ramda';

import { whenMinsLessThan } from 'utils/dates/dates';

import Link from 'components/links/Link';
import ArtworkAuctionPrice from './ArtworkAuctionPrice';
import { renderBidStatus } from './ArtworkAuctionBidStatus';

import { ArtworkAuctionBidActionProps } from './types';

interface ArtworkAuctionBidActionContainerProps {
  children: ReactNode;
}

export function ArtworkAuctionBidActionContainer(
  props: ArtworkAuctionBidActionContainerProps
): JSX.Element {
  const { children } = props;
  return (
    <Box
      sx={{
        padding: 'l',
        borderTop: 'solid 1px',
        borderColor: 'black.10',
      }}
    >
      {children}
    </Box>
  );
}

// conditionally render outbid status when <2 minutes remaining
export const renderAuctionBidButton = cond<
  ArtworkAuctionBidActionProps,
  JSX.Element
>([
  [
    (bid: ArtworkAuctionBidActionProps) => whenMinsLessThan(2, bid),
    always(
      <Button variant="outline" sx={{ width: '100%' }}>
        I understand, let me bid anyway
      </Button>
    ),
  ],

  [T, always(<Button sx={{ width: '100%' }}>Place a bid</Button>)],
]);

function ArtworkAuctionBidButton(
  props: ArtworkAuctionBidActionProps
): JSX.Element {
  const { bidPath } = props;

  return (
    <ArtworkAuctionBidActionContainer>
      <Link href={bidPath}>
        <a sx={{ display: 'block', textDecoration: 'none' }}>
          {renderAuctionBidButton(props)}
        </a>
      </Link>
    </ArtworkAuctionBidActionContainer>
  );
}

export default function ArtworkAuctionBidAction(
  props: ArtworkAuctionBidActionProps
): JSX.Element {
  const { myBid, minutesRemaining, bidPath } = props;

  if (myBid) {
    return (
      <ArtworkAuctionBidActionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <ArtworkAuctionPrice
            label="Your Bid"
            amountInETH={myBid.amountInETH}
          />
          {renderBidStatus({
            status: myBid.status,
            minutesRemaining,
            bidPath,
          })}
        </Flex>
      </ArtworkAuctionBidActionContainer>
    );
  }

  return (
    <ArtworkAuctionBidButton
      bidPath={bidPath}
      minutesRemaining={minutesRemaining}
    />
  );
}

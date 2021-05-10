/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Text, Button } from 'theme-ui';

import { NftMarketBidStatus } from '@f8n/f8n-contracts/src/types/generated/subgraph';

import Bid from 'types/Bid';

import { formatETHWithSuffix } from 'utils/formatters';

import SuccessIcon from 'assets/icons/tx-success.svg';
import ErrorIcon from 'assets/icons/error-icon.svg';
import CheckSuccessIcon from 'assets/icons/bid-highest.svg';

import Link from 'components/links/Link';
import ETHinUSD from 'components/ETHinUSD';

interface BidAuctionStatusProps {
  bid: Bid;
  artworkPath: string;
}

export function BidAuctionStatus(props: BidAuctionStatusProps): JSX.Element {
  const { bid, artworkPath } = props;

  const isHighest = bid.status === NftMarketBidStatus.Highest;

  const sx = getStyles();

  return (
    <Box sx={sx.status}>
      <Box sx={{ marginBottom: 'l' }}>
        <Flex sx={{ justifyContent: 'space-between', marginBottom: 's' }}>
          <Text variant="h.s">Your bid</Text>
          {isHighest ? <BidStatusHighest /> : <BidStatusOutbid />}
        </Flex>

        <Text variant="h.m" sx={{ marginBottom: 10 }}>
          {formatETHWithSuffix(bid.amountInETH)}
        </Text>
        <Text variant="h.xs" sx={{ color: 'black.60' }}>
          <ETHinUSD amount={bid.amountInETH} />
        </Text>
      </Box>

      {isHighest ? (
        <BidButtonHighest artworkPath={artworkPath} />
      ) : (
        <BidButtonOutbid artworkPath={artworkPath} />
      )}
    </Box>
  );
}

interface BidButtonHighestProps {
  artworkPath: string;
}

function BidButtonHighest(props: BidButtonHighestProps): JSX.Element {
  const { artworkPath } = props;
  return (
    <Link href={artworkPath}>
      <a sx={{ display: 'block' }}>
        <Button variant="outline" sx={{ width: '100%' }}>
          View NFT
        </Button>
      </a>
    </Link>
  );
}

interface BidButtonOutbidProps {
  artworkPath: string;
}

function BidButtonOutbid(props: BidButtonOutbidProps): JSX.Element {
  const { artworkPath } = props;
  return (
    <Link href={artworkPath}>
      <a sx={{ display: 'block' }}>
        <Button variant="outline" sx={{ width: '100%' }}>
          View NFT
        </Button>
      </a>
    </Link>
  );
}

interface BidAuctionStatusWonProps {
  artworkPath: string;
}

export function BidAuctionStatusWon(
  props: BidAuctionStatusWonProps
): JSX.Element {
  const { artworkPath } = props;
  const sx = getStyles();
  return (
    <Box sx={sx.status}>
      <Flex sx={{ alignItems: 'center', marginBottom: 's' }}>
        <CheckSuccessIcon sx={{ display: 'block' }} width={26} height={26} />
        <Text variant="h.s" sx={{ marginLeft: 's' }}>
          You won!
        </Text>
      </Flex>

      <Text variant="body.body" sx={{ marginBottom: 'l', maxWidth: 280 }}>
        Congratulations! You won the auction. Settle the auction to add it to
        your collection.
      </Text>
      <Link href={`${artworkPath}/settle`}>
        <a>
          <Button sx={{ width: '100%' }}>Settle auction</Button>
        </a>
      </Link>
    </Box>
  );
}

function BidStatusHighest(): JSX.Element {
  return (
    <Flex sx={{ alignItems: 'center', color: 'green.100' }}>
      <Text variant="h.xs" sx={{ marginRight: 12 }}>
        You’re winning!
      </Text>
      <SuccessIcon sx={{ display: 'block' }} width={26} height={26} />
    </Flex>
  );
}

function BidStatusOutbid(): JSX.Element {
  return (
    <Flex sx={{ alignItems: 'center', color: 'utility.red' }}>
      <Text variant="h.xs" sx={{ marginRight: 12 }}>
        Outbid
      </Text>
      <ErrorIcon sx={{ display: 'block' }} width={26} height={26} />
    </Flex>
  );
}

export function BidAuctionStatusSold(
  props: BidAuctionStatusWonProps
): JSX.Element {
  const { artworkPath } = props;
  const sx = getStyles();
  return (
    <Box sx={sx.status}>
      <Flex sx={{ alignItems: 'center', marginBottom: 's' }}>
        <CheckSuccessIcon sx={{ display: 'block' }} width={26} height={26} />
        <Text variant="h.s" sx={{ marginLeft: 's' }}>
          Your NFT sold!
        </Text>
      </Flex>

      <Text variant="body.body" sx={{ marginBottom: 'l', maxWidth: 280 }}>
        Congratulations! Your NFT has sold in auction. Settle the auction to
        claim your ETH.
      </Text>
      {/* TODO: Change this path */}
      <Link href={`${artworkPath}/settle`}>
        <a>
          <Button sx={{ width: '100%' }}>Settle auction</Button>
        </a>
      </Link>
    </Box>
  );
}

const getStyles = () => ({
  status: {
    paddingLeft: [null, null, 'l'],
    borderLeft: [null, null, 'solid 1px'],
    borderColor: [null, null, 'black.10'],
    gridColumn: ['1/3', null, '3/4'],
  },
});

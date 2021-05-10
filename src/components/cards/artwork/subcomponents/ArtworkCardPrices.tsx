/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex, Box } from 'theme-ui';
import { length } from 'ramda';

import ArtworkCardPriceTitle from './ArtworkCardPriceTitle';
import ArtworkCardPriceAmount from './ArtworkCardPriceAmount';

import { NftMarketAuctionStatus } from '@f8n/f8n-contracts/src/types/generated/subgraph';
import Auction from 'types/Auction';
import Artwork from 'types/Artwork';

import { formatETHWithSuffix } from 'utils/formatters';
import { isAuctionEnded, isAuctionNotYetListed } from 'utils/auctions/auctions';
import { isEmptyOrNil } from 'utils/helpers';
import { isTransferredOwnerMostRecent } from 'utils/artwork/artwork';
import { getArtworkHistory } from 'utils/history';

import useCountdown from 'hooks/use-countdown';
import { SOLD_FOR_LABEL } from 'lib/constants';

interface ArtworkCardPricesProps {
  mostRecentActiveAuction: Auction;
  className?: string;
  artwork: Artwork;
}

export default function ArtworkCardPrices(
  props: ArtworkCardPricesProps
): JSX.Element {
  const { mostRecentActiveAuction, className, artwork } = props;

  const auctionStatus = mostRecentActiveAuction?.status;
  const hasHighestBid = mostRecentActiveAuction?.highestBid;

  const artworkHistory = getArtworkHistory(artwork);

  // TODO: Make sure this hasDifferentOwner logic is shared with the ArtworkAuctionState
  // on the artwork page
  // and the ArtworkCardPrices component used by artwork cards
  // cc @gosseti
  // Or maybe change it be more declarative about what should be done with it
  const hasDifferentOwner = isTransferredOwnerMostRecent(artworkHistory);
  const isNotYetListed = isAuctionNotYetListed(mostRecentActiveAuction);
  const hasAuctionEnded = isAuctionEnded(mostRecentActiveAuction?.dateEnding);

  const isAuctionOpen = auctionStatus === NftMarketAuctionStatus.Open;

  if ((isNotYetListed || hasDifferentOwner) && !hasHighestBid) {
    return (
      <Box sx={{ padding: 'm' }}>
        <ArtworkCardPriceTitle>Reserve price</ArtworkCardPriceTitle>
        <ArtworkCardPriceAmount>—</ArtworkCardPriceAmount>
      </Box>
    );
  }

  if (hasAuctionEnded && hasHighestBid) {
    const highestBidAmount = Number(
      mostRecentActiveAuction.highestBid.amountInETH
    );
    return (
      <Box sx={{ padding: 'm' }} className={className}>
        <ArtworkCardPriceTitle>{SOLD_FOR_LABEL}</ArtworkCardPriceTitle>
        <ArtworkCardPriceAmount>
          {formatETHWithSuffix(highestBidAmount)}
        </ArtworkCardPriceAmount>
      </Box>
    );
  }

  if (isAuctionOpen && hasHighestBid) {
    const highestBidAmount = Number(
      mostRecentActiveAuction.highestBid.amountInETH
    );
    return (
      <Flex
        sx={{ padding: 'm', backgroundColor: 'black.100', width: '100%' }}
        className={className}
      >
        <Box sx={{ marginRight: 'm' }}>
          <ArtworkCardPriceTitle sx={{ color: 'black.20' }}>
            Current bid
          </ArtworkCardPriceTitle>
          <ArtworkCardPriceAmount sx={{ color: 'white.100' }}>
            {formatETHWithSuffix(highestBidAmount)}
          </ArtworkCardPriceAmount>
        </Box>
        <Box>
          <ArtworkCardPriceTitle sx={{ color: 'black.20' }}>
            Ending in
          </ArtworkCardPriceTitle>
          <ArtworkCardPriceAmount sx={{ color: 'white.100' }}>
            <ArtworkCardCountdown
              timestamp={mostRecentActiveAuction.dateEnding}
            />
          </ArtworkCardPriceAmount>
        </Box>
      </Flex>
    );
  }

  return (
    <Box sx={{ padding: 'm' }} className={className}>
      <ArtworkCardPriceTitle>Reserve price</ArtworkCardPriceTitle>
      <ArtworkCardPriceAmount>
        {formatETHWithSuffix(mostRecentActiveAuction?.reservePriceInETH)}
      </ArtworkCardPriceAmount>
    </Box>
  );
}

interface ArtworkCardCountdownProps {
  timestamp: string;
}

function ArtworkCardCountdown(props: ArtworkCardCountdownProps): JSX.Element {
  const { timestamp } = props;

  const { countdownParts, hasEnded } = useCountdown(timestamp);

  if (hasEnded) {
    return <Box>Auction has ended</Box>;
  }

  return (
    <Grid gap="xs" columns={`repeat(${length(countdownParts)}, 36px)`}>
      {countdownParts.map((part, key) => (
        <Box key={key}>
          <Box>
            {part.formattedValue}
            {part.shortLabel}
          </Box>
        </Box>
      ))}
    </Grid>
  );
}

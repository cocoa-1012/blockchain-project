/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text } from 'theme-ui';
import { useState } from 'react';
import { useHarmonicIntervalFn } from 'react-use';

import Auction from 'types/Auction';
import Account from 'types/Account';
import Artwork from 'types/Artwork';
import NftHistory from 'types/NftHistory';

import ArtworkAuctionPrice from './ArtworkAuctionPrice';
import AuctionStateOwnedBy from './auction-state/AuctionStateOwnedBy';
import AuctionStateGeneric from './auction-state/AuctionStateGeneric';
import ExternalLink from 'components/links/ExternalLink';

import { renderArtworkAuctionCountdown } from 'components/artworks/auction/ArtworkAuctionCountdown';

import { getMinutesRemaining } from 'utils/dates/dates';
import { isAuctionEnded, isAuctionNotYetListed } from 'utils/auctions/auctions';
import { isTransferredOwnerMostRecent } from 'utils/artwork/artwork';
import { buildBidPath, getMyBid } from 'utils/bids/bids';

import { SOLD_FOR_LABEL } from 'lib/constants';

interface ArtworkAuctionStateProps {
  auction: Auction;
  artworkHistory: NftHistory[];
  creator: Account;
  artwork: Artwork;
  publicAddress: string;
}

export default function ArtworkAuctionState(
  props: ArtworkAuctionStateProps
): JSX.Element {
  const { auction, artworkHistory, creator, artwork, publicAddress } = props;

  const auctionBids = auction?.bids ?? [];

  const myBid = getMyBid(publicAddress, auctionBids);
  const bidPath = buildBidPath({ creator, artwork });
  const hasAuctionEnded = isAuctionEnded(auction?.dateEnding);
  const isNotYetListed = isAuctionNotYetListed(auction);
  const hasDifferentOwnerMostRecent = isTransferredOwnerMostRecent(
    artworkHistory
  );

  const isDraftArwork = artwork.status === 'DRAFT';

  const [minutesRemaining, setMinutesRemaining] = useState(
    getMinutesRemaining(auction?.dateEnding)
  );

  useHarmonicIntervalFn(() => {
    const minutesRemaining = getMinutesRemaining(auction?.dateEnding);
    setMinutesRemaining(minutesRemaining);
  }, 1000);

  if (isDraftArwork || !artwork.ownedOrListedBy) {
    return null;
  }

  if (hasDifferentOwnerMostRecent) {
    return <AuctionStateOwnedBy ownedBy={artwork.ownedOrListedBy.id} />;
  }

  if (isNotYetListed) {
    return null;
  }

  // if the artwork has been sold
  if (hasAuctionEnded) {
    return (
      <AuctionStateOwnedBy ownedBy={auction.highestBid.bidder.id}>
        <ArtworkAuctionPrice
          label={SOLD_FOR_LABEL}
          amountInETH={auction.highestBid.amountInETH}
          className="auction-meta"
        />
      </AuctionStateOwnedBy>
    );
  }

  // TODO: In the case where the piece has been transferred, the info about the latest auction isn't relevant if the auction hasn’t met its reserve and is waiting to go active
  if (!auction?.highestBid) {
    return (
      <AuctionStateGeneric
        label="Reserve Price"
        amountInETH={auction.reservePriceInETH}
        minutesRemaining={minutesRemaining}
        bidPath={bidPath}
      >
        <Grid sx={{ rowGap: 10 }}>
          <Text variant="body.body" sx={{ position: 'relative', top: -4 }}>
            Once a bid has been placed and the reserve price has been met, a 24
            hour auction for this artwork will begin.
          </Text>
          <ExternalLink href="https://help.foundation.app/en/articles/4742997-a-complete-guide-to-collecting-nfts-and-how-auctions-work">
            Learn more
          </ExternalLink>
        </Grid>
      </AuctionStateGeneric>
    );
  }

  return (
    <AuctionStateGeneric
      label="Current Bid"
      amountInETH={auction.highestBid.amountInETH}
      myBid={myBid}
      minutesRemaining={minutesRemaining}
      bidPath={bidPath}
    >
      {renderArtworkAuctionCountdown({
        endDate: auction.dateEnding,
        minutesRemaining,
      })}
    </AuctionStateGeneric>
  );
}

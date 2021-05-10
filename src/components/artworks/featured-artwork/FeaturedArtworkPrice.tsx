/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Text, ThemeUIStyleObject } from 'theme-ui';

import ArtworkAuctionPrice from '../auction/ArtworkAuctionPrice';
import UserTagDynamic from 'components/users/UserTagDynamic';
import ArtworkAuctionCountdown from '../auction/ArtworkAuctionCountdown';
import GraySquare from 'components/GraySquare';
import FollowPopover from 'components/follows/FollowPopover';

import Auction from 'types/Auction';
import Artwork from 'types/Artwork';

import { isAuctionEnded, isAuctionNotYetListed } from 'utils/auctions/auctions';
import { isTransferredOwnerMostRecent } from 'utils/artwork/artwork';
import { getArtworkHistory } from 'utils/history';

interface FeaturedArtworkPriceProps {
  auction: Auction;
  minutesRemaining: number;
  artwork: Artwork;
  isLoading: boolean;
}

export default function FeaturedArtworkPrice(
  props: FeaturedArtworkPriceProps
): JSX.Element {
  const { auction, artwork, isLoading } = props;

  const isEnded = isAuctionEnded(auction?.dateEnding);
  const isNotYetListed = isAuctionNotYetListed(auction);
  const artworkHistory = getArtworkHistory(artwork);

  // TODO: Make sure this hasDifferentOwner logic is shared with the ArtworkAuctionState
  // on the artwork page
  // and the ArtworkCardPrices component used by artwork cards
  // cc @gosseti
  // Or maybe change it be more declarative about what should be done with it
  const hasDifferentOwner = isTransferredOwnerMostRecent(artworkHistory);

  const priceStyles: ThemeUIStyleObject = {
    paddingRight: [null, 'l'],
    borderRight: [null, 'solid 1px'],
    borderColor: [null, 'black.10'],
    marginRight: [null, 'l'],
    marginBottom: ['m', 0],
    textAlign: ['left'],
    whiteSpace: 'pre',
  };

  if (isLoading) {
    return (
      <Flex sx={{ flexDirection: ['column', 'row'] }}>
        <SkeletonLoadingBlock sx={priceStyles} />
        <SkeletonLoadingBlock />
      </Flex>
    );
  }

  if (hasDifferentOwner) {
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        <Text variant="h.body" sx={{ marginBottom: 5 }}>
          Owned by
        </Text>
        <Flex sx={{ marginY: 'auto' }}>
          <FollowPopover publicKey={auction.highestBid.bidder.id}>
            <UserTagDynamic publicKey={auction.highestBid.bidder.id} />
          </FollowPopover>
        </Flex>
      </Flex>
    );
  }

  if (isNotYetListed) {
    return null;
  }

  if (isEnded) {
    return (
      <Flex sx={{ flexDirection: ['column', 'row'] }}>
        <ArtworkAuctionPrice
          label="Sold for"
          amountInETH={auction.highestBid.amountInETH}
          sx={priceStyles}
        />
        <Flex sx={{ flexDirection: 'column' }}>
          <Text variant="h.body" sx={{ marginBottom: 5 }}>
            Owned by
          </Text>
          <Flex sx={{ marginY: 'auto' }}>
            <FollowPopover publicKey={auction.highestBid.bidder.id}>
              <UserTagDynamic publicKey={auction.highestBid.bidder.id} />
            </FollowPopover>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  if (!auction?.highestBid) {
    return (
      <ArtworkAuctionPrice
        label="Reserve Price"
        amountInETH={auction.reservePriceInETH}
        sx={{ textAlign: 'left' }}
      />
    );
  }

  return (
    <Flex sx={{ flexDirection: ['column', 'row'] }}>
      <ArtworkAuctionPrice
        label="Current Bid"
        amountInETH={auction.highestBid.amountInETH}
        sx={priceStyles}
      />
      <Box sx={{ textAlign: 'left', maxWidth: 340 }}>
        <ArtworkAuctionCountdown endDate={auction?.dateEnding} />
      </Box>
    </Flex>
  );
}

interface SkeletonLoadingBlockProps {
  className?: string;
}

function SkeletonLoadingBlock(props: SkeletonLoadingBlockProps): JSX.Element {
  const { className } = props;
  return (
    <Box className={className}>
      <GraySquare
        height={[18, null, null, null, 20]}
        width={80}
        sx={{ marginBottom: [7, null, null, null, 8] }}
      />
      <GraySquare
        height={[35, null, null, null, 43]}
        width={150}
        sx={{ marginBottom: [7, null, null, null, 8] }}
      />
      <GraySquare height={[18, null, null, null, 20]} width={50} />
    </Box>
  );
}

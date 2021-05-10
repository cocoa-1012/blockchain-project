/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Grid, Text, ThemeUIStyleObject } from 'theme-ui';
import { format } from 'date-fns/fp';

import Bid from 'types/Bid';
import Artwork from 'types/Artwork';

import { buildArtworkCardAssetUrl, buildPosterUrl } from 'utils/assets';
import { isAuctionEnded } from 'utils/auctions/auctions';
import { parseUnixString } from 'utils/dates/dates';
import { buildArtworkPath, buildUserProfilePath } from 'utils/artwork/artwork';
import { isEmptyOrNil } from 'utils/helpers';

import { ArtworkAuctionCountdownTimer } from 'components/artworks/auction/ArtworkAuctionCountdown';
import UserTagRaw from 'components/users/UserTagRaw';
import ArtworkAuctionPrice from 'components/artworks/auction/ArtworkAuctionPrice';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import Link from 'components/links/Link';
import FollowPopover from 'components/follows/FollowPopover';

import { BidAuctionStatus, BidAuctionStatusWon } from './BidStatus';

import useCountdown from 'hooks/use-countdown';

interface BidActivityCardProps {
  bid: Bid;
  artwork: Artwork;
}

export default function BidActivityCard(
  props: BidActivityCardProps
): JSX.Element {
  const { bid, artwork } = props;

  const sx = getStyles();

  // TODO: Add skeleton
  // defensive guard for when artwork doesn’t exist
  if (!artwork) {
    return null;
  }

  const assetUrl = buildArtworkCardAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const hasAuctionEnded = isAuctionEnded(bid.nftMarketAuction.dateEnding);

  const artworkPath = buildArtworkPath({ artwork, user: artwork.creator });

  const profilePath = buildUserProfilePath({ user: artwork.creator });

  return (
    <Grid sx={sx.grid}>
      <Box sx={{ borderRadius: 8, overflow: 'hidden' }}>
        <Link href={artworkPath}>
          <a sx={sx.media}>
            <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
          </a>
        </Link>
      </Box>

      <Box>
        <Box sx={{ marginBottom: [0, null, 'l'] }}>
          <Flex>
            <Link href={artworkPath}>
              <a sx={sx.title}>
                <Text variant="h.s" sx={{ marginBottom: 's' }}>
                  {artwork.name}
                </Text>
              </a>
            </Link>
          </Flex>

          <Flex>
            <FollowPopover publicKey={artwork?.creator?.publicKey}>
              <Link href={profilePath}>
                <a sx={{ textDecoration: 'none' }}>
                  <UserTagRaw user={artwork.creator} />
                </a>
              </Link>
            </FollowPopover>
          </Flex>
        </Box>

        <Flex sx={{ display: ['none', null, 'flex'] }}>
          <ArtworkAuctionPrice
            label={hasAuctionEnded ? 'Winning bid' : 'Current bid'}
            amountInETH={bid.nftMarketAuction.highestBid.amountInETH}
            sx={sx.price}
          />

          {hasAuctionEnded ? (
            <BidAuctionEndedInfo dateEnding={bid.nftMarketAuction.dateEnding} />
          ) : (
            <Box>
              <Text variant="h.body" sx={{ marginBottom: 5 }}>
                Auction ending in
              </Text>
              <ArtworkAuctionCountdownTimer
                timestamp={bid.nftMarketAuction.dateEnding}
              />
            </Box>
          )}
        </Flex>
      </Box>

      {/* Responsive components for small screen view */}
      <Flex
        sx={{
          display: ['flex', null, 'none'],
          gridColumn: '1 / span 2',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'black.10',
        }}
      >
        <ArtworkAuctionPrice
          label={hasAuctionEnded ? 'Winning bid' : 'Current bid'}
          amountInETH={bid.nftMarketAuction.highestBid.amountInETH}
          sx={{ ...sx.price, py: 's' }}
        />

        {hasAuctionEnded ? (
          <BidAuctionEndedInfo dateEnding={bid.nftMarketAuction.dateEnding} />
        ) : (
          <Box sx={{ py: 's' }}>
            <Text variant="h.body" sx={{ marginBottom: 5 }}>
              Auction ending in
            </Text>
            <Text>
              <BidAuctionCountdown
                dateEnding={bid.nftMarketAuction.dateEnding}
              />
            </Text>
          </Box>
        )}
      </Flex>

      {hasAuctionEnded ? (
        <BidAuctionStatusWon artworkPath={artworkPath} />
      ) : (
        <BidAuctionStatus bid={bid} artworkPath={artworkPath} />
      )}
    </Grid>
  );
}

interface BidAuctionEndedInfoProps {
  dateEnding: string;
}

function BidAuctionEndedInfo(props: BidAuctionEndedInfoProps) {
  const { dateEnding } = props;

  const parsedDate = parseUnixString(dateEnding);

  return (
    <Box sx={{ py: ['s', null, 0] }}>
      <Text variant="h.body" sx={{ marginBottom: 5 }}>
        Auction ended
      </Text>
      <Text variant="h.m" sx={{ marginBottom: 10 }}>
        {format('MMM dd', parsedDate)}
      </Text>
      <Text variant="h.xs" sx={{ color: 'black.60' }}>
        {format('yyyy', parsedDate)}
      </Text>
    </Box>
  );
}

interface BidAuctionCountdownProps {
  dateEnding: string;
}

function BidAuctionCountdown(props: BidAuctionCountdownProps): JSX.Element {
  const { dateEnding } = props;

  const { countdownParts, hasEnded } = useCountdown(dateEnding);

  if (hasEnded) {
    return (
      <Box>
        <Text>—</Text>
        <Text variant="h.xs" sx={{ color: 'black.60' }}>
          Auction has ended
        </Text>
      </Box>
    );
  }

  return (
    <Flex>
      {countdownParts.map((part) => (
        <Box key={part.label} sx={{ marginRight: 'xs' }}>
          <Text variant="h.xs">
            {part.value}
            {part.shortLabel}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}

const getStyles = () => {
  const grid: ThemeUIStyleObject = {
    padding: ['s', null, null, null, 'l'],
    boxShadow: 's',
    backgroundColor: 'white.100',
    border: 'solid 1px',
    borderColor: 'black.10',
    borderRadius: 10,
    alignItems: 'center',
    gridTemplateColumns: [
      'min(25%, 260px) 1fr',
      null,
      'min(25%, 260px) 4fr 3fr',
    ],
    gap: ['l', null, null, 'xl'],
  };

  const card: ThemeUIStyleObject = {
    backgroundColor: 'black.5',
    borderRadius: 8,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const media: ThemeUIStyleObject = {
    display: 'block',
    textDecoration: 'none',
  };

  const title: ThemeUIStyleObject = {
    display: 'block',
    textDecoration: 'none',
    color: 'black.100',
  };

  const price: ThemeUIStyleObject = {
    paddingRight: ['m', null, 'l'],
    borderRight: 'solid 1px',
    borderColor: 'black.10',
    marginRight: ['m', null, 'l'],
  };

  return { grid, card, media, title, price };
};

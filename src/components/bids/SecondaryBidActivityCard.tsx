/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import {
  jsx,
  Box,
  Flex,
  Grid,
  Text,
  Button,
  ThemeUIStyleObject,
} from 'theme-ui';
import { useState } from 'react';
import { NftMarketAuction } from '@f8n/f8n-contracts/src/types/generated/subgraph';
import { useHarmonicIntervalFn } from 'react-use';

import Artwork from 'types/Artwork';

import { buildArtworkCardAssetUrl, buildPosterUrl } from 'utils/assets';
import { isAuctionEnded } from 'utils/auctions/auctions';
import { buildArtworkPath, buildUserProfilePath } from 'utils/artwork/artwork';

import { ArtworkAuctionCountdownTimer } from 'components/artworks/auction/ArtworkAuctionCountdown';
import UserTagRaw from 'components/users/UserTagRaw';
import ArtworkAuctionPrice from 'components/artworks/auction/ArtworkAuctionPrice';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import Link from 'components/links/Link';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { BidAuctionStatusSold } from './BidStatus';
import FollowPopover from 'components/follows/FollowPopover';
import { userTag } from 'components/users/styles';

interface BidActivityCardProps {
  bid: NftMarketAuction;
  artwork: Artwork;
}

export default function SecondaryBidActivityCard(
  props: BidActivityCardProps
): JSX.Element {
  const { bid, artwork } = props;

  const sx = getStyles();

  const bidderPublicKey = bid?.highestBid?.bidder?.id;
  const currentOwnerPublicKey = bid?.seller?.id;

  const { data: bidderData } = useUserByPublicKey({
    publicKey: bidderPublicKey,
    enabled: Boolean(bidderPublicKey),
  });

  const { data: currentOwnerData } = useUserByPublicKey({
    publicKey: currentOwnerPublicKey,
    enabled: Boolean(currentOwnerPublicKey),
  });

  // TODO: Add skeleton
  // defensive guard for when artwork doesn’t exist
  if (!artwork) {
    return null;
  }

  const assetUrl = buildArtworkCardAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const hasAuctionEnded = isAuctionEnded(bid.dateEnding);

  const artworkPath = buildArtworkPath({ artwork, user: artwork.creator });
  const creatorProfilePath = buildUserProfilePath({ user: artwork.creator });

  const bidderProfilePath = buildUserProfilePath({ user: bidderData?.user });
  const settlePath = buildArtworkPath({
    artwork,
    user: currentOwnerData?.user,
  });

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
              <Link href={creatorProfilePath}>
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
            amountInETH={bid.highestBid.amountInETH}
            sx={sx.price}
          />

          {hasAuctionEnded ? (
            <Box>
              <Text variant="h.body" sx={{ marginBottom: 's' }}>
                Winning bidder
              </Text>
              <FollowPopover publicKey={bidderPublicKey}>
                <Link href={bidderProfilePath}>
                  <a sx={{ textDecoration: 'none' }}>
                    <UserTagRaw user={bidderData?.user} sx={userTag} />
                  </a>
                </Link>
              </FollowPopover>
            </Box>
          ) : (
            <BidAuctionCountdown dateEnding={bid.dateEnding} />
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
          amountInETH={bid.highestBid.amountInETH}
          sx={{ ...sx.price, py: 's' }}
        />

        {hasAuctionEnded ? (
          <Box sx={{ py: 's' }}>
            <Text variant="h.body" sx={{ marginBottom: 's' }}>
              Winning bidder
            </Text>
            <FollowPopover publicKey={bidderPublicKey}>
              <Link href={bidderProfilePath}>
                <a sx={{ textDecoration: 'none' }}>
                  <UserTagRaw user={bidderData?.user} sx={userTag} />
                </a>
              </Link>
            </FollowPopover>
          </Box>
        ) : (
          <BidAuctionCountdown dateEnding={bid.dateEnding} sx={{ py: 's' }} />
        )}
      </Flex>

      {hasAuctionEnded ? (
        <BidAuctionStatusSold artworkPath={settlePath} />
      ) : (
        <Box
          sx={{
            gridColumn: ['1/3', null, '3/4'],
            paddingLeft: [null, null, 'l'],
            borderLeft: [null, null, 'solid 1px'],
            borderColor: [null, null, 'black.10'],
          }}
        >
          <Flex sx={{ alignItems: 'center', marginBottom: 's' }}>
            <Text variant="h.s">Your auction is live!</Text>
          </Flex>

          <Text variant="body.body" sx={{ marginBottom: 'l', maxWidth: 280 }}>
            Congratulations, your NFT received a bid! The 24-hour auction
            countdown has started.
          </Text>
          <Link href={`${artworkPath}`}>
            <a sx={{ width: '100%', alignSelf: 'flex-end' }}>
              <Button variant="outline" sx={{ width: '100%' }}>
                View NFT
              </Button>
            </a>
          </Link>
        </Box>
      )}
    </Grid>
  );
}

interface BidAuctionCountdownProps {
  dateEnding: string;
  className?: string;
}

const getHasFinished = (dateEnding: string) => {
  return Math.floor(Date.now() / 1000).toString() > dateEnding;
};

function BidAuctionCountdown(props: BidAuctionCountdownProps): JSX.Element {
  const { dateEnding, className } = props;

  const [hasFinished, setHasFinished] = useState<boolean>(() =>
    getHasFinished(dateEnding)
  );

  const setFinished = () => {
    const hasFinished = getHasFinished(dateEnding);

    setHasFinished(hasFinished);
  };

  useHarmonicIntervalFn(setFinished, hasFinished ? null : 1000);

  return (
    <Box className={className}>
      {!hasFinished && (
        <Text variant="h.body" sx={{ marginBottom: 5 }}>
          Auction ending in
        </Text>
      )}
      <ArtworkAuctionCountdownTimer
        timestamp={dateEnding}
        sx={{ ml: [null, null, 'auto'] }}
      />
    </Box>
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
    paddingRight: 'l',
    borderRight: 'solid 1px',
    borderColor: 'black.10',
    marginRight: 'l',
  };

  return { grid, card, media, title, price };
};

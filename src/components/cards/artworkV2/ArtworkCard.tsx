/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import Link from 'next/link';
import { useState } from 'react';

import ArtworkCardContainer from 'components/cards/artworkV2/ArtworkCardContainer';
import ArtworkCardCore from 'components/cards/artworkV2/ArtworkCardCore';
import ListedState from 'components/cards/artworkV2/states/ListedState';
import InAuctionState from 'components/cards/artworkV2/states/InAuctionState';
import SoldState from 'components/cards/artworkV2/states/SoldState';

import Artwork from 'types/Artwork';
import Creator from 'types/Creator';
import Account from 'types/Account';
import Auction from 'types/Auction';
import { ArtworkAndOwnerStatus } from 'types/artwork/artwork';
import { positionAbsolute } from 'types/styles';
import { ArtworkEvent } from 'types/Event';

import { buildArtworkPath } from 'utils/artwork/artwork';
import { buildBidPath } from 'utils/bids/bids';
import { areKeysEqual } from 'utils/users';
import SettledState from './states/SettledState';
import TransferredState from './states/TransferredState';

import useArtworkState from 'hooks/use-artwork-state';
import ArtworkCardEvent from './ArtworkCardEvent';

interface ArtworkCardProps {
  className?: string;
  artwork: Artwork;
  creator: Creator;
  event?: ArtworkEvent;
  isOwner?: boolean;
  currentUser?: Account;
  mostRecentActiveAuction?: Auction;
  users: Account[];
  hasApprovedMarketContract: boolean;
}

export default function ArtworkCard(props: ArtworkCardProps): JSX.Element {
  const {
    className,
    artwork,
    creator,
    event,
    isOwner,
    currentUser,
    mostRecentActiveAuction,
    users,
    hasApprovedMarketContract,
  } = props;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const artworkState = useArtworkState({ artwork, isOwner });

  const creatorArtworkPath = buildArtworkPath({
    user: creator?.account,
    artwork,
  });
  const currentUserArtworkPath = buildArtworkPath({
    user: currentUser,
    artwork,
  });

  const reservePrice = mostRecentActiveAuction?.reservePriceInETH;
  const bidPath = buildBidPath({ creator: creator?.account, artwork });

  const highestBidAmount = Number(
    mostRecentActiveAuction?.highestBid?.amountInETH
  );
  const dateEnding = mostRecentActiveAuction?.dateEnding;

  const currentOrUpcomingOwner =
    artworkState === ArtworkAndOwnerStatus.SoldOwner ||
    areKeysEqual([
      currentUser?.publicKey,
      mostRecentActiveAuction?.highestBid?.bidder?.id,
    ]);

  const isCurrentUserCreator = areKeysEqual([
    creator?.account?.id,
    currentUser?.publicKey,
  ]);

  const biddersUsers = mostRecentActiveAuction?.bids?.map((bid) =>
    users.find((user) => areKeysEqual([user.publicKey, bid.bidder.id]))
  );

  const listPath = isCurrentUserCreator
    ? `${creatorArtworkPath}/list`
    : hasApprovedMarketContract
    ? `${currentUserArtworkPath}/list`
    : `${currentUserArtworkPath}/approve`;

  return (
    <Box
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <ArtworkCardEvent
        event={event}
        artworkPath={creatorArtworkPath}
        isHovered={isHovered}
      />
      <ArtworkCardContainer className={className} isHovered={isHovered}>
        <Link href={creatorArtworkPath}>
          <a
            sx={{
              position: positionAbsolute,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              color: 'transparent',
              userSelect: 'none',
            }}
          >
            {artwork.name}
          </a>
        </Link>
        <ArtworkCardCore
          artwork={artwork}
          creator={creator}
          isOwner={isOwner}
          listPath={listPath}
          currentUser={currentUser}
          artworkState={artworkState}
        />

        {(artworkState === ArtworkAndOwnerStatus.ListedNonOwner ||
          artworkState === ArtworkAndOwnerStatus.ListedOwner ||
          artworkState === ArtworkAndOwnerStatus.PriceChangedNonOwner ||
          artworkState === ArtworkAndOwnerStatus.PriceChangedOwner) && (
          <ListedState
            bidPath={bidPath}
            isOwner={artworkState === ArtworkAndOwnerStatus.ListedOwner}
            reservePrice={reservePrice}
          />
        )}

        {(artworkState === ArtworkAndOwnerStatus.InAuctionNonOwner ||
          artworkState === ArtworkAndOwnerStatus.InAuctionOwner) && (
          <InAuctionState
            currentBidPrice={highestBidAmount}
            dateEnding={dateEnding}
            bidders={biddersUsers}
          />
        )}

        {(artworkState === ArtworkAndOwnerStatus.SoldNonOwner ||
          artworkState === ArtworkAndOwnerStatus.SoldOwner) && (
          <SoldState
            soldPrice={highestBidAmount}
            settlePath={`${currentUserArtworkPath}/settle`}
            isOwner={currentOrUpcomingOwner}
          />
        )}

        {(artworkState === ArtworkAndOwnerStatus.SettledNonOwner ||
          artworkState === ArtworkAndOwnerStatus.SettledOwner) && (
          <SettledState
            soldPrice={highestBidAmount}
            listPath={listPath}
            ownerAddress={artwork?.ownedOrListedBy?.id}
            isOwner={artworkState === ArtworkAndOwnerStatus.SettledOwner}
          />
        )}

        {artworkState === ArtworkAndOwnerStatus.TransferredNonOwner && (
          <TransferredState ownerAddress={artwork?.ownedOrListedBy?.id} />
        )}
      </ArtworkCardContainer>
    </Box>
  );
}

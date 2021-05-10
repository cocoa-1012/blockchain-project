/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button, Flex, Text } from 'theme-ui';
import { ReactNode } from 'react';
import { cond, equals, T, ifElse, allPass } from 'ramda';

import ArtworkCardPrices from './ArtworkCardPrices';
import Link from 'components/links/Link';

import ArtworkCardPriceTitle from './ArtworkCardPriceTitle';

import Account from 'types/Account';
import Artwork from 'types/Artwork';
import { ComputedArtworkStatus } from 'types/artwork/artwork';

import { formatETHWithSuffix } from 'utils/formatters';
import {
  auctionHasHighestBid,
  isAuctionStatusOpen,
} from 'utils/auctions/auctions';
import {
  buildArtworkPath,
  buildCreatorArtworkPath,
  getSlug,
} from 'utils/artwork/artwork';
import { areKeysEqual } from 'utils/users';

interface ArtworkCardMetaProps {
  artworkStatus: ComputedArtworkStatus;
  artwork: Artwork;
  user?: Account;
  hasApprovedMarketContract?: boolean;
}

interface ArtworkActionButtonProps extends ArtworkCardMetaProps {
  artwork: Artwork;
  user?: Account;
  children?: ReactNode;
  href?: string;
  txHash?: string;
  hasApprovedMarketContract?: boolean;
  className?: string;
}

function ArtworkActionButton(props: ArtworkActionButtonProps) {
  const { children, href } = props;
  return (
    <Box sx={{ padding: 'm', marginTop: 'auto' }}>
      <Link href={href}>
        <a sx={{ display: 'block', positition: 'relative', zIndex: 3 }}>
          <ActionButton>{children}</ActionButton>
        </a>
      </Link>
    </Box>
  );
}

function ListButton(props: ArtworkCardMetaProps): JSX.Element {
  const { artwork } = props;

  const tokenId = artwork?.tokenId;
  const slugPrefix = getSlug(artwork);

  const listArtworkPath = `/creator/${slugPrefix}${tokenId}/list`;

  return (
    <ArtworkActionButton {...props} href={listArtworkPath}>
      List NFT
    </ArtworkActionButton>
  );
}

function SettleButton(props: ArtworkActionButtonProps): JSX.Element {
  const { artwork, children } = props;

  const tokenId = artwork?.tokenId;
  const slugPrefix = getSlug(artwork);

  const settleAuctionPath = `/creator/${slugPrefix}${tokenId}/settle`;

  return (
    <Link href={settleAuctionPath}>
      <a
        sx={{
          display: 'flex',
          flex: 1,
          textDecoration: 'none',
          positition: 'relative',
          zIndex: 3,
          maxWidth: 180,
          marginLeft: 'auto',
        }}
      >
        <ActionButton>{children}</ActionButton>
      </a>
    </Link>
  );
}

function RelistButton(props: ArtworkActionButtonProps): JSX.Element {
  const { artwork, user, children, hasApprovedMarketContract, className } =
    props;

  const creatorPublicAddress = artwork?.creator?.id;
  const userPublicAddress = user?.publicKey;
  const isCurrentUserCreator = areKeysEqual([
    creatorPublicAddress,
    userPublicAddress,
  ]);

  const artworkPath = buildArtworkPath({ artwork, user: user });
  const creatorArtworkPath = buildCreatorArtworkPath(artwork);

  const relistPath = isCurrentUserCreator
    ? `${creatorArtworkPath}/list`
    : hasApprovedMarketContract
    ? `${artworkPath}/list`
    : `${artworkPath}/approve`;

  return (
    <Link href={relistPath}>
      <a
        sx={{
          display: 'flex',
          flex: 1,
          textDecoration: 'none',
          positition: 'relative',
          zIndex: 3,
          maxWidth: 180,
          marginLeft: 'auto',
        }}
        className={className}
      >
        <ActionButton>{children}</ActionButton>
      </a>
    </Link>
  );
}

function SettleAuction(props: ArtworkCardMetaProps): JSX.Element {
  const { artwork } = props;

  return (
    <Flex sx={{ padding: 'm', marginTop: 'auto', alignItems: 'center' }}>
      <Box sx={{ whiteSpace: 'pre', marginRight: 's' }}>
        <ArtworkCardPriceTitle>Sold For</ArtworkCardPriceTitle>

        <Text variant="h.xs" sx={{ lineHeight: 1 }}>
          {formatETHWithSuffix(
            artwork.mostRecentActiveAuction?.highestBid?.amountInETH
          )}
        </Text>
      </Box>

      <SettleButton {...props}>Settle</SettleButton>
    </Flex>
  );
}

function Relist(props: ArtworkActionButtonProps): JSX.Element {
  const { artwork } = props;

  const amountInETH = artwork?.mostRecentActiveAuction?.highestBid?.amountInETH;

  // TODO: Make sure computed artwork status maps somewhere else so we don't
  // need a conditional in this component
  return amountInETH ? (
    <Flex sx={{ padding: 'm', marginTop: 'auto', alignItems: 'center' }}>
      <Box sx={{ whiteSpace: 'pre', marginRight: 's' }}>
        <ArtworkCardPriceTitle>Sold For</ArtworkCardPriceTitle>

        <Text variant="h.xs" sx={{ lineHeight: 1 }}>
          {formatETHWithSuffix(amountInETH)}
        </Text>
      </Box>

      <RelistButton {...props}>List NFT</RelistButton>
    </Flex>
  ) : (
    <Flex sx={{ padding: 'm', marginTop: 'auto', alignItems: 'center' }}>
      {/* <Box sx={{ whiteSpace: 'pre', marginRight: 's' }}></Box> */}

      <RelistButton {...props} sx={{ maxWidth: 'none' }}>
        List NFT
      </RelistButton>
    </Flex>
  );
}

function ArtworkTransferred(): JSX.Element {
  return (
    <Flex sx={{ padding: 'm', marginTop: 'auto', alignItems: 'center' }}>
      <Box sx={{ whiteSpace: 'pre', marginRight: 's' }}>
        <ArtworkCardPriceTitle>Transferred</ArtworkCardPriceTitle>
        <Text variant="h.xs" sx={{ lineHeight: 1 }}>
          —
        </Text>
      </Box>
    </Flex>
  );
}

// TODO: Use this on the profile version of the actions below
function TransferredWithRelist(props: ArtworkActionButtonProps): JSX.Element {
  return (
    <Flex sx={{ padding: 'm', marginTop: 'auto', alignItems: 'center' }}>
      <Box sx={{ whiteSpace: 'pre', marginRight: 's' }}>
        <ArtworkCardPriceTitle>Transferred</ArtworkCardPriceTitle>

        <Text variant="h.xs" sx={{ lineHeight: 1 }}>
          —
        </Text>
      </Box>
      <RelistButton {...props}>List NFT</RelistButton>
    </Flex>
  );
}

interface ActionButtonProps {
  children: ReactNode;
}

function ActionButton(props: ActionButtonProps): JSX.Element {
  const { children } = props;
  return (
    <Button
      variant="outline"
      sx={{
        minHeight: 55,
        width: '100%',
        borderColor: 'black.10',
        marginTop: -5,
        marginBottom: -6,
        '@media (hover: hover)': {
          '&:hover': {
            borderColor: 'black.100',
          },
        },
      }}
    >
      {children}
    </Button>
  );
}

const renderArtworkCardPrices = (props: ArtworkCardMetaProps) => {
  const { artwork } = props;

  return ifElse(
    allPass([isAuctionStatusOpen, auctionHasHighestBid]),
    (artwork: Artwork) => (
      <Flex sx={{ flex: 'auto' }}>
        <ArtworkCardPrices
          artwork={artwork}
          mostRecentActiveAuction={artwork.mostRecentActiveAuction}
        />
      </Flex>
    ),
    (artwork: Artwork) => (
      <Flex sx={{ marginTop: 'auto' }}>
        <ArtworkCardPrices
          artwork={artwork}
          mostRecentActiveAuction={artwork.mostRecentActiveAuction}
        />
      </Flex>
    )
  )(artwork);
};

export const renderArtworkCardActionsDashboard = (
  props: ArtworkCardMetaProps
): JSX.Element => {
  const { artworkStatus } = props;

  return cond<{ artwork: Artwork }, JSX.Element>([
    // when status is transffered, render transferred state
    [
      () => equals(artworkStatus, ComputedArtworkStatus.Transferred),
      ArtworkTransferred,
    ],
    // when status is unsettled, render the settle button
    [
      () => equals(artworkStatus, ComputedArtworkStatus.Unsettled),
      SettleAuction,
    ],
    // when status is minted, render the list button
    [() => equals(artworkStatus, ComputedArtworkStatus.Minted), ListButton],
    // return nothing when the artwork’s burned
    [() => equals(artworkStatus, ComputedArtworkStatus.Burned), () => null],
    // otherwise render the price component (Listed and Settled)
    [T, renderArtworkCardPrices],
  ])(props);
};

// TODO: Change these actions to reflect what we want shown on the profile
export const renderArtworkCardActionsProfile = (
  props: ArtworkCardMetaProps
): JSX.Element => {
  const { artworkStatus } = props;

  // TODO: Make sure we're using the ComputedArtworkStatus options properly

  return cond<{ artwork: Artwork }, JSX.Element>([
    // when status is transferred, render transferred state
    [
      () => equals(artworkStatus, ComputedArtworkStatus.Transferred),
      TransferredWithRelist,
    ],
    // when status is unsettled, render the settle button
    [
      () => equals(artworkStatus, ComputedArtworkStatus.Unsettled),
      SettleAuction,
    ],
    [() => equals(artworkStatus, ComputedArtworkStatus.Settled), Relist],
    [() => equals(artworkStatus, ComputedArtworkStatus.Minted), Relist],
    // otherwise render the price component (Listed and Settled)
    [T, renderArtworkCardPrices],
  ])(props);
};

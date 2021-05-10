/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';

import PopoverExtras from 'components/popover/PopoverExtras';
import PopoverMenu from 'components/popover/PopoverMenu';

import TransferIcon from 'assets/icons/transfer-icon.svg';
import ChangePriceIcon from 'assets/icons/change-price-icon.svg';
import UnlistIcon from 'assets/icons/unlist-icon.svg';
import BurnIcon from 'assets/icons/burn-icon.svg';

import Artwork from 'types/Artwork';
import { ComputedArtworkStatus } from 'types/artwork/artwork';

import {
  buildArtworkPath,
  buildCreatorArtworkPath,
} from 'utils/artwork/artwork';
import { areKeysEqual } from 'utils/users';
import Account from 'types/Account';

interface ArtworkCardPopoverOwnerProps {
  status: ComputedArtworkStatus;
  artwork: Artwork;
  user: Account;
  setIsHovered: (arg0: boolean) => void;
}

export default function ArtworkCardPopoverOwner(
  props: ArtworkCardPopoverOwnerProps
): JSX.Element {
  const { status, artwork, user, setIsHovered } = props;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });
  const artworkPathWithCurrentUser = buildArtworkPath({
    artwork,
    user: user,
  });
  const creatorArtworkPath = buildCreatorArtworkPath(artwork);

  // Check if the current owner is also the creator
  const isCreatorCurrentOwner = areKeysEqual([
    artwork?.creator?.id,
    user?.publicKey,
  ]);

  const options = getPopoverOptionsOwner({
    artworkPath,
    artworkPathWithCurrentUser,
    creatorArtworkPath,
    isCreatorCurrentOwner,
  })[status];

  if (options) {
    return (
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ position: 'relative', zIndex: 4 }}
      >
        <PopoverExtras sx={{ marginY: -5 }}>
          <PopoverMenu options={options} />
        </PopoverExtras>
      </Box>
    );
  }
  return null;
}

interface PopoverOptions {
  artworkPathWithCurrentUser: string;
  artworkPath: string;
  creatorArtworkPath: string;
  isCreatorCurrentOwner: boolean;
}

// TODO: Make sure we're using the ComputedArtworkStatus options properly
const getPopoverOptionsOwner = ({
  artworkPathWithCurrentUser,
  artworkPath,
  creatorArtworkPath,
  isCreatorCurrentOwner,
}: PopoverOptions) => ({
  [ComputedArtworkStatus.Listed]: [
    {
      icon: (
        <ChangePriceIcon sx={{ display: 'block' }} width={22} height={22} />
      ),
      children: 'Change reserve price',
      href: `${artworkPathWithCurrentUser}/change-price`, // TODO: Use user path
    },
    {
      icon: <UnlistIcon sx={{ display: 'block' }} width={22} height={22} />,
      children: 'Unlist',
      href: `${artworkPathWithCurrentUser}/unlist`, // TODO: Use user path
    },
  ],
  // TODO: Decide if transfer should use current user rather than creator username
  [ComputedArtworkStatus.Transferred]: [
    {
      icon: <TransferIcon sx={{ display: 'block' }} width={18} height={18} />,
      children: 'Transfer NFT',
      href: `${artworkPath}/transfer`,
    },
    ...(isCreatorCurrentOwner
      ? [
          {
            icon: <BurnIcon sx={{ display: 'block' }} width={22} height={22} />,
            children: <Text sx={{ color: '#F93A3A' }}>Burn NFT</Text>,
            href: `${creatorArtworkPath}/burn`,
          },
        ]
      : []),
  ],
  // TODO: Decide if transfer should use current user rather than creator username
  [ComputedArtworkStatus.Settled]: [
    {
      icon: <TransferIcon sx={{ display: 'block' }} width={18} height={18} />,
      children: 'Transfer NFT',
      href: `${artworkPath}/transfer`,
    },
    ...(isCreatorCurrentOwner
      ? [
          {
            icon: <BurnIcon sx={{ display: 'block' }} width={22} height={22} />,
            children: <Text sx={{ color: '#F93A3A' }}>Burn NFT</Text>,
            href: `${creatorArtworkPath}/burn`,
          },
        ]
      : []),
  ],
  // TODO: Decide if transfer should use current user rather than creator username
  [ComputedArtworkStatus.Minted]: [
    {
      icon: <TransferIcon sx={{ display: 'block' }} width={18} height={18} />,
      children: 'Transfer NFT',
      href: `${artworkPath}/transfer`,
    },
    ...(isCreatorCurrentOwner
      ? [
          {
            icon: <BurnIcon sx={{ display: 'block' }} width={22} height={22} />,
            children: <Text sx={{ color: '#F93A3A' }}>Burn NFT</Text>,
            href: `${creatorArtworkPath}/burn`,
          },
        ]
      : []),
  ],
});

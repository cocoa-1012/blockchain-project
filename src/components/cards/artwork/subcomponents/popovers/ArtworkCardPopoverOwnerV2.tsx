import { UseMutationResult } from 'react-query';
import { ReactNode } from 'react';

import PopoverExtras from 'components/popover/PopoverExtras';
import PopoverMenu from 'components/popover/PopoverMenu';
import SpinnerStroked from 'components/SpinnerStroked';
import Text from 'components/base/Text';
import Icon from 'components/Icon';
import Box from 'components/base/Box';

import UnhideIcon from 'assets/icons/eye-icon-bold.svg';
import HideIcon from 'assets/icons/hide-icon.svg';
import TransferIcon from 'assets/icons/transfer-icon.svg';
import ChangePriceIcon from 'assets/icons/change-price-icon.svg';
import BurnIcon from 'assets/icons/burn-icon.svg';
import UnlistIcon from 'assets/icons/unlist-icon.svg';
import TagIcon from 'assets/icons/tags-icon.svg';

import { ArtworkV2, BasicArtwork, CollectionArtwork } from 'types/Artwork';
import { ComputedArtworkStatus } from 'types/artwork/artwork';
import WalletUser from 'types/WalletUser';

import {
  SetArtworkUserVisibility,
  SetArtworkUserVisibilityVariables,
} from 'graphql/server/mutations/set-artwork-user-visibility.generated';

import { notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import {
  buildArtworkPath,
  buildCreatorArtworkPath,
} from 'utils/artwork/artwork';

interface ArtworkCardPopoverOwnerProps {
  artwork: ArtworkV2;
  status: ComputedArtworkStatus;
  currentUser: WalletUser;
  setIsHovered: (arg0: boolean) => void;
  setArtworkUserVisibility?: UseMutationResult<
    SetArtworkUserVisibility,
    Error,
    SetArtworkUserVisibilityVariables
  >;
}

interface PopoverOption {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  enabled: boolean;
}

export default function ArtworkCardPopoverOwnerV2(
  props: ArtworkCardPopoverOwnerProps
): JSX.Element {
  const {
    artwork,
    status,
    currentUser,
    setArtworkUserVisibility,
    setIsHovered,
  } = props;

  const hasSplits = artwork?.splitRecipients?.aggregate?.count > 0;
  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });
  const creatorArtworkPath = buildCreatorArtworkPath(artwork);
  const hasTags = artwork?.tags.length !== 0;

  const isCreatorOwner = areKeysEqual([
    artwork?.ownerPublicKey,
    artwork?.publicKey,
    currentUser?.publicAddress,
  ]);

  const isOwner = areKeysEqual([
    artwork?.ownerPublicKey,
    currentUser?.publicAddress,
  ]);

  const isCreator = areKeysEqual([
    artwork?.publicKey,
    currentUser?.publicAddress,
  ]);

  const isHidden = notEmptyOrNil(artwork.artworkUserVisibilities);

  const { mutate, isLoading } = setArtworkUserVisibility;

  const unhideArtworkLabel = isLoading ? 'Hiding NFT' : 'Hide NFT';
  const hideArtworkLabel = isLoading ? 'Unhiding NFT' : 'Unhide NFT';
  const tagLabel = !hasTags ? 'Add tags' : 'Edit tags';

  const authorization = {
    canUnlist: isOwner && [ComputedArtworkStatus.Listed].includes(status),
    canHide: (hasSplits && !isCreator) || !isCreator,
    canChangePrice: isOwner && [ComputedArtworkStatus.Listed].includes(status),
    canBurn:
      isCreatorOwner &&
      [
        ComputedArtworkStatus.Settled,
        ComputedArtworkStatus.Minted,
        ComputedArtworkStatus.Transferred,
      ].includes(status),
    canTransfer:
      isOwner &&
      [
        ComputedArtworkStatus.Minted,
        ComputedArtworkStatus.Settled,
        ComputedArtworkStatus.Transferred,
      ].includes(status),
    canTag: isCreator,
  };

  const options: PopoverOption[] = [
    {
      enabled: authorization.canUnlist,
      icon: <Icon icon={UnlistIcon} width={22} height={22} />,
      children: 'Unlist',
      href: `${artworkPath}/unlist`,
    },
    {
      enabled: authorization.canTransfer,
      icon: <Icon icon={TransferIcon} width={18} height={18} />,
      children: 'Transfer NFT',
      href: `${artworkPath}/transfer`,
    },
    {
      enabled: authorization.canChangePrice,
      icon: <Icon icon={ChangePriceIcon} width={22} height={22} />,
      children: 'Change reserve price',
      href: `${artworkPath}/change-price`,
    },
    {
      enabled: authorization.canTag,
      icon: <Icon icon={TagIcon} width={20} height={22} />,
      children: tagLabel,
      href: `/creator/${artwork?.id}/tags?redirect=profile`,
    },
    {
      enabled: authorization.canBurn,
      icon: <Icon icon={BurnIcon} width={22} height={22} />,
      children: <Text css={{ color: '#F93A3A' }}>Burn NFT</Text>,
      href: `${creatorArtworkPath}/burn`,
    },
    {
      enabled: authorization.canHide,
      icon: isLoading ? (
        <SpinnerStroked size={20} />
      ) : isHidden ? (
        <Icon icon={UnhideIcon} width={22} height={16} />
      ) : (
        <Icon icon={HideIcon} width={22} height={22} />
      ),
      children: isHidden ? hideArtworkLabel : unhideArtworkLabel,
      onClick: () => {
        mutate({
          tokenId: artwork?.tokenId,
          shouldHide: !isHidden,
        });
      },
    },
  ];

  const enabledOptions = options.filter((option) => option.enabled);
  const hasOptions = notEmptyOrNil(enabledOptions);

  if (hasOptions) {
    return (
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        css={{
          position: 'relative',
          zIndex: 4,
          display: 'none',
          '@bp1': { display: 'block' },
        }}
      >
        <PopoverExtras sx={{ marginY: -5 }}>
          <PopoverMenu options={enabledOptions} />
        </PopoverExtras>
      </Box>
    );
  }
  return null;
}

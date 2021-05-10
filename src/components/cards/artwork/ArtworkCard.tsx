/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Grid, ThemeUIStyleObject, useThemeUI } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';

import Account from 'types/Account';
import Auction from 'types/Auction';
import Creator from 'types/Creator';
import Artwork from 'types/Artwork';
import { StyleObject } from 'types/styles';
import { VideoAssetQuality } from 'types/Assets';

import Link from 'components/links/Link';
import UserTagRaw from 'components/users/UserTagRaw';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import ArtworkCardTitle from './subcomponents/ArtworkCardTitle';
import ArtworkCardPrices from './subcomponents/ArtworkCardPrices';
import ArtworkCardPopoverOwner from './subcomponents/popovers/ArtworkCardPopoverOwner';
import ArtworkCardSkeleton from './ArtworkCardSkeleton';
import FollowPopover from 'components/follows/FollowPopover';
import CardContextProvider, { useCardContext } from '../CardContext';
import { renderArtworkCardActionsProfile } from './subcomponents/ArtworkCardActions';

import {
  buildArtworkPath,
  buildUserProfilePath,
  getComputedArtworkStatus,
} from 'utils/artwork/artwork';
import { transitions } from 'utils/themes/main/theme';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { publicKeyOrIdOrAddress } from 'utils/helpers';

export default function ArtworkCardWithContext(
  props: ArtworkCardProps
): JSX.Element {
  return (
    <CardContextProvider>
      <ArtworkCard {...props} />
    </CardContextProvider>
  );
}

interface ArtworkCardProps {
  artwork: Artwork;
  user?: Account;
  creator: Creator;
  mostRecentActiveAuction?: Auction;
  isOwner?: boolean;
  hasApprovedMarketContract?: boolean;
}

export function ArtworkCard(props: ArtworkCardProps): JSX.Element {
  const {
    artwork,
    creator,
    mostRecentActiveAuction,
    isOwner,
    user,
    hasApprovedMarketContract,
  } = props;

  const { theme } = useThemeUI();

  const account = creator?.account;

  const { isHovered, setIsHovered } = useCardContext();

  const sx = getArtworkCardStyles();

  const breakpointIndex = useBreakpointIndex({ defaultIndex: 2 });

  const isMobile = breakpointIndex <= 1;

  if (!artwork) {
    return <ArtworkCardSkeleton />;
  }

  const artworkPath = buildArtworkPath({ user: account, artwork });

  const profilePath = buildUserProfilePath({ user: account });

  const assetUrl = buildArtworkAssetUrl(
    {
      h: 640,
      q: 70,
      auto: 'compress',
      quality: VideoAssetQuality.Preview,
    },
    artwork
  );

  const posterUrl = buildPosterUrl(artwork);

  const artworkStatus = getComputedArtworkStatus({ artwork, user });

  const isOwnerOnDesktop = isOwner && !isMobile;

  return (
    <Flex
      sx={sx.card}
      style={{
        transform: isHovered && 'translateY(-4px)',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        boxShadow: isHovered && theme.shadows.m,
      }}
      className="artwork-card"
    >
      <Link href={artworkPath}>
        <a sx={link}>{artwork.name}</a>
      </Link>
      <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />

      <Grid gap="m" sx={sx.title}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <ArtworkCardTitle>{artwork.name}</ArtworkCardTitle>
          {isOwnerOnDesktop && (
            <ArtworkCardPopoverOwner
              artwork={artwork}
              user={user}
              status={artworkStatus}
              setIsHovered={setIsHovered}
            />
          )}
        </Flex>

        <Flex sx={{ marginTop: 'auto' }}>
          <FollowPopover
            publicKey={publicKeyOrIdOrAddress(account)}
            sx={popover}
          >
            <Link href={profilePath}>
              <a sx={popoverLink}>
                <UserTagRaw user={account} color="currentColor" />
              </a>
            </Link>
          </FollowPopover>
        </Flex>
      </Grid>

      {/* hide the owner actions on mobile
      until list is in working order on mobile */}
      {isOwnerOnDesktop ? (
        <Flex
          sx={sx.activity}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {renderArtworkCardActionsProfile({
            artwork,
            user: user,
            artworkStatus: artworkStatus,
            hasApprovedMarketContract: hasApprovedMarketContract,
          })}
        </Flex>
      ) : (
        <Flex sx={sx.activity}>
          <ArtworkCardPrices
            mostRecentActiveAuction={mostRecentActiveAuction}
            artwork={artwork}
          />
        </Flex>
      )}
    </Flex>
  );
}

const link: ThemeUIStyleObject = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2,
  textIndent: '-9999rem',
};

const popover: ThemeUIStyleObject = {
  display: 'flex',
  zIndex: 3,
  position: 'relative',
  color: 'black.60',
  transition: transitions.smooth.fast,
  '@media (hover: hover)': {
    '&:hover': {
      color: 'black.100',
    },
  },
};

const popoverLink: ThemeUIStyleObject = {
  textDecoration: 'none',
  color: 'black.60',
  transition: transitions.smooth.fast,
  '@media (hover: hover)': {
    '&:hover': {
      color: 'black.100',
    },
  },
};

export const cardStyles: ThemeUIStyleObject = {
  backgroundColor: 'white.100',
  display: 'flex',
  flex: 'auto',
  flexDirection: 'column',
  borderRadius: 10,
  overflow: 'hidden',
  boxShadow: 's',
  transition: transitions.smooth.fast,
  textDecoration: 'none',
  color: 'inherit',
  position: 'relative',
};

// TODO: organise these into nicer typed styles
export const getArtworkCardStyles = (): StyleObject => ({
  title: {
    boxShadow: 's',
    padding: 'm',
    flex: 1,
  },
  activity: {
    flexDirection: 'column',
  },
  card: {
    ...cardStyles,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 'm',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: 's',
      },
    },
  },
});

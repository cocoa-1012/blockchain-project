/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Box, Flex, ThemeUIStyleObject, Button } from 'theme-ui';
import Link from 'next/link';

import ArtworkCardMedia from 'components/cards/artworkV2/ArtworkCardMedia';
import UserTagRaw from 'components/users/UserTagRaw';
import FollowPopover from 'components/follows/FollowPopover';
import ArtworkCardDescription from './ArtworkCardDescription';
import ArtworkPopoverOwner from 'components/cards/artworkV2/ArtworkPopoverOwner';

import { buildUserProfilePath } from 'utils/artwork/artwork';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { publicKeyOrIdOrAddress } from 'utils/helpers';
import { transitions } from 'utils/themes/main/theme';

import Account from 'types/Account';
import { ArtworkAndOwnerStatus } from 'types/artwork/artwork';
import Artwork from 'types/Artwork';
import Creator from 'types/Creator';
import { VideoAssetQuality } from 'types/Assets';

interface ArtworkCardCoreProps {
  artwork: Artwork;
  creator: Creator;
  isOwner?: boolean;
  currentUser?: Account;
  artworkState: ArtworkAndOwnerStatus;
  listPath: string;
}

export default function ArtworkCardCore(
  props: ArtworkCardCoreProps
): JSX.Element {
  const { artwork, creator, isOwner, currentUser, artworkState, listPath } =
    props;

  const assetUrl = buildArtworkAssetUrl(
    { h: 640, q: 80, quality: VideoAssetQuality.Preview },
    artwork
  );

  const account = creator?.account;

  const posterUrl = buildPosterUrl(artwork);
  const profilePath = buildUserProfilePath({ user: account });

  const showList =
    artworkState === ArtworkAndOwnerStatus.MintedOwner ||
    artworkState === ArtworkAndOwnerStatus.TransferredOwner ||
    artworkState === ArtworkAndOwnerStatus.UnlistedOwner;

  return (
    <>
      <ArtworkCardMedia
        assetUrl={assetUrl}
        posterUrl={posterUrl}
        sx={{ marginBottom: 'l', pointerEvents: 'none' }}
      />
      <Box sx={{ paddingX: 'l' }}>
        <Flex>
          <Heading
            variant="stnd.m"
            sx={{
              fontWeight: 600,
              marginBottom: 's',
              marginRight: 'auto',
              overflowWrap: 'break-word',
            }}
          >
            {artwork.name}
          </Heading>
          {isOwner && (
            <ArtworkPopoverOwner
              artwork={artwork}
              user={currentUser}
              status={artworkState}
            />
          )}
        </Flex>

        <Box
          sx={{
            marginBottom: 'm',
          }}
        >
          <ArtworkCardDescription text={artwork.description} />
        </Box>
        <Flex sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
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

          {showList && (
            <Link href={listPath} passHref>
              <Button
                as="a"
                variant="outline"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 'auto',
                  marginBottom: 'm',
                  borderColor: 'black.10',
                  zIndex: 2,
                  '@media (hover: hover)': {
                    '&:hover': {
                      borderColor: 'black.100',
                    },
                  },
                }}
              >
                List NFT
              </Button>
            </Link>
          )}
        </Flex>
      </Box>
    </>
  );
}

const popover: ThemeUIStyleObject = {
  display: 'flex',
  zIndex: 3,
  position: 'relative',
  color: 'black.60',
  marginBottom: 'm',
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

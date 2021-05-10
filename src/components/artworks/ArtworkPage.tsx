/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Flex, Text } from 'theme-ui';
import dynamic from 'next/dynamic';
import { css } from 'stitches.config';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import {
  pointerEventsNone,
  positionRelative,
  positionAbsolute,
  flexDirectionForPrefix,
  StyleObject,
} from 'types/styles';
import { BasicArtwork } from 'types/Artwork';
import WalletUser from 'types/WalletUser';
import { PercentSplitWithUsers } from 'types/Split';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { buildArtworkPath, getArtworkTokenId } from 'utils/artwork/artwork';
import { buildArtworkTweet } from 'utils/twitter-templates';
import {
  getUsernameOrAddress,
  notEmptyOrNil,
  publicKeyOrIdOrAddress,
} from 'utils/helpers';
import { buildArtworkPageAssetUrl, isModel } from 'utils/assets';

import Model from 'components/model-media/Model';
import { ProductMedia } from 'components/media/Media';
import ArtworkMeta from './ArtworkMeta';
import ArtworkHeader from './ArtworkHeader';
import ArtworkCreatorBio from './auction/ArtworkCreatorBio';
import Body from 'components/Body';
import UserTag from 'components/users/UserTag';
import PopoverShare from 'components/popover/PopoverShare';
import PopoverOverflow from 'components/popover/PopoverOverflow';
import FollowPopover from 'components/follows/FollowPopover';
import { FullscreenToggle } from 'components/buttons/MediaButtons';

import ThreeDIcon from 'assets/icons/3d-icon.svg';
import Account from 'types/Account';

const ArtworkContent = dynamic(() => import('./ArtworkContent'));

interface ArtworkPageProps {
  artwork: BasicArtwork;
  user: WalletUser;
  percentSplits: PercentSplitWithUsers;
  currentUserPublicKey: string;
  twitterUsername: string;
  tags?: string[];
}

const modelStyles = css({
  width: '100%',
})();

export default function ArtworkPage(props: ArtworkPageProps): JSX.Element {
  const {
    artwork,
    user,
    percentSplits,
    twitterUsername,
    tags,
    currentUserPublicKey,
  } = props;

  const sx = artworkPageStyles();

  const creatorPublicKey = publicKeyOrIdOrAddress(artwork?.creator);

  const { data: creatorData, isLoading: isCreatorLoading } = useUserByPublicKey(
    {
      publicKey: creatorPublicKey,
      refetchOnWindowFocus: false,
    }
  );

  const creator = creatorData?.user;

  const hasBio = notEmptyOrNil(creator?.bio);

  const twitterShareText = buildArtworkTweet({
    creatorName: getUsernameOrAddress(creator),
    artworkPath: buildArtworkPath({
      user: creator,
      artwork,
    }),
    twitterUsername,
  });

  const assetUrl = buildArtworkPageAssetUrl(artwork);
  const isModelMedia = isModel(assetUrl);

  return (
    <>
      <Box sx={sx.container}>
        <Box sx={sx.artworkContainer}>
          {isModelMedia ? (
            <ModelView assetUrl={assetUrl} />
          ) : (
            <Box sx={sx.artwork}>
              <ProductMedia artwork={artwork} controls />
            </Box>
          )}
        </Box>

        <Body sx={sx.header}>
          <Flex>
            <FollowPopover publicKey={creator?.publicKey}>
              <UserTag user={creator} isLoading={isCreatorLoading} />
            </FollowPopover>
          </Flex>

          <Flex
            sx={{
              marginLeft: 'auto',
              pointerEvents: isCreatorLoading ? 'none' : 'all',
            }}
          >
            <PopoverOverflow
              sx={{
                '& .popover-button': {
                  width: [null, 56],
                  height: [null, 56],
                  boxShadow: ['s'],
                  '@media (hover: hover)': {
                    '&:hover': {
                      boxShadow: ['m'],
                    },
                    '&:active': {
                      boxShadow: ['s'],
                    },
                  },
                },
              }}
            />
            <PopoverShare shareText={twitterShareText} />
          </Flex>
        </Body>
      </Box>
      <Body>
        <Grid columns={[1, null, 2]} gap={['l', null, null, 'xl']}>
          <Box>
            <ArtworkHeader artwork={artwork} />
            <ArtworkMeta
              description={artwork.description}
              artwork={artwork}
              percentSplits={percentSplits}
              creatorPublicKey={creatorPublicKey}
              currentUserPublicKey={currentUserPublicKey}
              tags={tags}
            />
          </Box>

          <Box sx={sx.content}>
            <ArtworkContent
              creator={creator}
              tokenId={getArtworkTokenId(artwork)}
              publicAddress={user?.publicAddress}
            />
          </Box>
        </Grid>
        {hasBio && <ArtworkCreatorBio creator={creator} />}
      </Body>
    </>
  );
}

const artworkPageStyles = (): StyleObject => ({
  container: {
    display: [null, null, 'flex'],
    position: positionRelative,
    flexDirection: flexDirectionForPrefix,
    flex: '1 0 auto',
    height: ['none !important', 'none !important', 'calc(100vh - 168px)'],
  },
  content: {
    paddingTop: [null, null, 'xl'],
    maxWidth: [null, null, 620],
    flex: 'auto',
    marginLeft: 'auto',
    width: '100%',
    zIndex: 3,
  },
  header: {
    transform: 'translateY(-1.5rem)',
    display: ['flex', null, 'grid'],
    gridTemplateColumns: [null, null, '1fr 1fr'],
    gap: ['s', null, null, 'xl'],
    marginBottom: '-1.5rem',
    position: 'relative',
    zIndex: 4,
  },
  artworkContainer: {
    backgroundColor: '#F2F2F2',
    display: 'flex',
    position: positionRelative,
    flex: 1,
    minHeight: ['66vh', null, '0'],
    '&:before': {
      content: '""',
      display: 'block',
      position: positionAbsolute,
      pointerEvents: pointerEventsNone,
      bottom: 0,
      left: 0,
      right: 0,
      height: '4rem',
      background:
        'linear-gradient(0deg, rgba(230,230,230,1) 0%, rgba(230,230,230,0) 100%)',
    },
  },
  artwork: {
    display: 'flex',
    width: '100%',
    minHeight: ['66vh', null, '0'],
    mx: ['m', null, 'calc(8rem + calc(14vmin - 8rem))'],
    mt: ['xxxl', null, 'calc(8rem + calc(14vmin - 8rem))'],
    mb: ['xl', null, 'calc(8rem + calc(14vmin - 8rem))'],
  },
});

interface ModelViewProps {
  assetUrl: string;
}

function ModelView(props: ModelViewProps) {
  const { assetUrl } = props;
  const fullscreenHandle = useFullScreenHandle();

  const handleFullscreen = () => {
    if (fullscreenHandle.active) {
      return fullscreenHandle.exit();
    }
    return fullscreenHandle.enter();
  };

  return (
    <Box sx={modelViewStyles.modelContainer}>
      <Box sx={modelViewStyles.model}>
        <FullScreen
          handle={fullscreenHandle}
          sx={{
            display: 'flex',
            width: '100%',
            backgroundColor: fullscreenHandle.active
              ? 'black.10'
              : 'transparent',
          }}
        >
          <Model src={assetUrl} className={modelStyles} />

          <Box sx={modelViewStyles.threeDIcon}>
            <Box sx={{ width: 20 }}>
              <ThreeDIcon />
            </Box>
            <Text variant="h.xs" sx={{ ml: 'xxs' }}>
              3D
            </Text>
          </Box>

          <FullscreenToggle
            sx={modelViewStyles.fullscreen}
            onClick={handleFullscreen}
            isFullscreen={fullscreenHandle.active}
          />
        </FullScreen>
      </Box>
    </Box>
  );
}

const modelViewStyles = {
  modelContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: 1600,
    minHeight: ['75vh', null, '0'],
    mx: ['m', null, 'auto'],
    px: [null, null, 'm'],
  },
  model: {
    display: 'flex',
    width: '100%',
    mt: ['xxxl', null, 'xxxxl'],
    mb: ['xl', null, 'xl'],
    boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.1)',
    borderRadius: 20,
    position: positionRelative,
    overflow: 'hidden',
  },
  threeDIcon: {
    display: 'flex',
    position: positionAbsolute,
    top: [18, null, 25],
    left: [18, null, 25],
    zIndex: 2,
    opacity: 0.5,
  },
  fullscreen: {
    position: positionAbsolute,
    bottom: [18, null, 25],
    right: [18, null, 25],
  },
};

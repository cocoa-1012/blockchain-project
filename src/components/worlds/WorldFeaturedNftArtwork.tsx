/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Heading, Text } from 'theme-ui';

import Body from 'components/Body';
import CategoryCardMedia from 'components/cards/worlds/WorldCardMedia';

import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';

import {
  positionRelative,
  positionAbsolute,
  textAlignCenter,
  textAlignRight,
} from 'types/styles';
import Artwork from 'types/Artwork';
import Account from 'types/Account';
import { VideoAssetQuality } from 'types/Assets';

import FollowPopover from 'components/follows/FollowPopover';
import UserTag from 'components/users/UserTag';

interface WorldFeaturedNftArtworkProps {
  title: string;
  featuredArtwork: Artwork;
  curatedBy: Account;
}

export default function WorldFeaturedNftArtwork(
  props: WorldFeaturedNftArtworkProps
): JSX.Element {
  const { title, featuredArtwork, curatedBy } = props;

  const assetUrl = buildArtworkAssetUrl(
    { w: 1200, q: 80, quality: VideoAssetQuality.Max },
    featuredArtwork
  );
  const posterUrl = buildPosterUrl(featuredArtwork);

  const sx = getStyles();

  return (
    <Box sx={sx.container}>
      <Box sx={{ position: 'relative' }}>
        <GradientOverlay />
        <Box
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
        >
          <CategoryCardMedia posterUrl={posterUrl} assetUrl={assetUrl} />
        </Box>

        <Box sx={sx.coverImage} />
      </Box>
      <Body sx={{ position: 'relative' }}>
        <Flex sx={sx.pin}>
          <Heading variant="stnd.xxxl" sx={sx.title}>
            {title}
          </Heading>
        </Flex>
        {curatedBy && (
          <Flex
            sx={{
              position: 'absolute',
              bottom: 0,
              left: ['50%', null, 'initial'],
              // Has to be above the feature dartwork as that is positioned relatively and will cover this unit otherwise
              zIndex: 5,
              // 28px is half the height of the UserTag pill
              transform: [
                'translate(-50%, 24px)',
                'translate(-50%, 28px)',
                'translateY(calc(-100% + 28px))',
              ],
            }}
          >
            <Flex
              sx={{
                flexDirection: 'column',
                alignItems: ['center', null, 'flex-start'],
              }}
            >
              <Text
                variant="stnd.xs"
                sx={{
                  color: 'white.100',
                  fontWeight: 600,
                  opacity: 0.8,
                  mb: 's',
                }}
              >
                Curated by
              </Text>
              <FollowPopover publicKey={curatedBy.publicKey}>
                <UserTag
                  user={curatedBy}
                  sx={{ justifyContent: ['center', null, 'flex-start'] }}
                />
              </FollowPopover>
            </Flex>
          </Flex>
        )}

        <Flex
          sx={{
            display: ['none', null, 'flex'],
            justifyContent: ['center', null, 'flex-end'],
            position: 'relative',
            zIndex: 4,
            // 28px is half the height of the UserTag pill
            transform: 'translateY(calc(-100% + 28px))',
          }}
        >
          <Flex sx={{ flexDirection: 'column' }}>
            <Text
              variant="stnd.xs"
              sx={{
                color: 'white.100',
                fontWeight: 600,
                opacity: 0.8,
                mb: 's',
              }}
            >
              Featured artwork by
            </Text>
            <FollowPopover publicKey={featuredArtwork.creator.publicKey}>
              <UserTag
                user={featuredArtwork.creator}
                sx={{ justifyContent: ['center', null, 'flex-end'] }}
              />
            </FollowPopover>
          </Flex>
        </Flex>
      </Body>
    </Box>
  );
}

function GradientOverlay() {
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage:
          'linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    />
  );
}

const getStyles = () => ({
  coverImage: {
    height: 400,
  },
  container: {
    position: positionRelative,
    marginBottom: ['xl', null, 'xs'],
  },
  pin: {
    position: positionAbsolute,
    bottom: 0,
    left: ['50%', null, 'initial'],
    transform: ['translate(-50%, -80px)', null, 'translateY(-180px)'],
    zIndex: 3,
  },
  title: {
    color: 'white.100',
    fontWeight: 600,
    textAlign: [textAlignCenter, null, textAlignRight],
  },
});

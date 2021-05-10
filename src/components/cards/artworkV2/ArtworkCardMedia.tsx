/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Image, AspectRatio } from 'theme-ui';
import { css } from 'stitches.config';

import CardVideo from 'components/cards/shared/CardVideoV2';

import { isVideo, isModel } from 'utils/assets';
import { notEmptyOrNil } from 'utils/helpers';

import ArtworkCardThreeDLabel from '../artwork/subcomponents/ArtworkCardThreeDLabel';

import { positionRelative } from 'types/styles';

interface ArtworkCardMediaProps {
  assetUrl: string;
  posterUrl?: string;
  className?: string;
}

export default function ArtworkCardMedia(
  props: ArtworkCardMediaProps
): JSX.Element {
  const { assetUrl, posterUrl, className } = props;

  const hasAssetUrl = notEmptyOrNil(assetUrl);

  if (hasAssetUrl) {
    return (
      <Box className={className}>
        <RenderArtworkMedia url={assetUrl} posterUrl={posterUrl} />
      </Box>
    );
  }

  return <AspectRatio ratio={1 / 1} sx={{ backgroundColor: 'black.5' }} />;
}

interface RenderArtworkMediaProps {
  url: string;
  posterUrl?: string;
}

const ThreeDLabelStyles = css({
  position: 'absolute',
  left: '$5',
  top: '$5',
})();

function RenderArtworkMedia(props: RenderArtworkMediaProps): JSX.Element {
  const { url, posterUrl } = props;

  const isUrlVideo = isVideo(url);
  const isUrlModel = isModel(url);

  if (isUrlVideo) {
    return <CardVideo posterUrl={posterUrl} url={url} />;
  }

  if (isUrlModel) {
    return (
      <Box sx={{ position: positionRelative, height: '100%', width: '100%' }}>
        <ArtworkCardThreeDLabel className={ThreeDLabelStyles} />
        <Image
          loading="lazy"
          src={posterUrl}
          sx={{
            display: 'block',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            backgroundColor: 'black.5',
          }}
        />
      </Box>
    );
  }

  return (
    <Image
      loading="lazy"
      src={url}
      sx={{
        objectFit: 'cover',
        display: 'block',
        width: '100%',
        height: '100%',
        maxHeight: '1000px',
        backgroundColor: 'black.5',
      }}
    />
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React, { useState, useEffect } from 'react';
import { jsx, Image, AspectRatio, Box } from 'theme-ui';
import { css } from 'stitches.config';
import useIsInViewport from 'use-is-in-viewport';
import { AnimatePresence, motion } from 'framer-motion';

import { isModel, isVideo } from 'utils/assets';
import { notEmptyOrNil } from 'utils/helpers';

import ArtworkCardMediaContainer from './ArtworkCardMediaContainer';
import CardVideo from '../../shared/CardVideo';
import ArtworkCardThreeDLabel from './ArtworkCardThreeDLabel';

import { positionRelative } from 'types/styles';

const MotionImage = motion(Image);
const MotionCardVideo = motion(CardVideo);

interface ArtworkCardMediaProps {
  assetUrl: string;
  posterUrl?: string;
}

export default function ArtworkCardMedia(
  props: ArtworkCardMediaProps
): JSX.Element {
  const { assetUrl, posterUrl } = props;
  const [hasBeenInViewport, setHasBeenInViewport] = useState(false);

  const hasAssetUrl = notEmptyOrNil(assetUrl);

  const [isInViewport, targetRef] = useIsInViewport();

  useEffect(() => {
    if (isInViewport) {
      setHasBeenInViewport(true);
    }
  }, [isInViewport]);

  if (hasAssetUrl) {
    return (
      <ArtworkCardMediaContainer ref={targetRef}>
        <AnimatePresence exitBeforeEnter>
          <RenderArtworkCardMedia
            url={assetUrl}
            posterUrl={posterUrl}
            hasBeenInViewport={hasBeenInViewport}
          />
        </AnimatePresence>
      </ArtworkCardMediaContainer>
    );
  }

  return <AspectRatio ratio={1 / 1} sx={{ backgroundColor: 'black.5' }} />;
}

interface RenderArtworkCardMediaProps {
  url: string;
  hasBeenInViewport: boolean;
  posterUrl?: string;
}

const ThreeDLabelStyles = css({
  position: 'absolute',
  left: '$5',
  top: '$5',
})();

function RenderArtworkCardMedia(
  props: RenderArtworkCardMediaProps
): JSX.Element {
  const { url, posterUrl, hasBeenInViewport } = props;

  const isUrlVideo = isVideo(url);
  const isUrlModel = isModel(url);

  const animationProps = {
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.1 },
  };

  if (!hasBeenInViewport && (isUrlVideo || isUrlModel)) {
    return (
      <motion.div {...animationProps} sx={{ backgroundColor: 'black.5' }} />
    );
  }

  if (isUrlVideo) {
    return (
      <MotionCardVideo {...animationProps} posterUrl={posterUrl} url={url} />
    );
  }

  if (isUrlModel) {
    return (
      <Box sx={{ position: positionRelative, height: '100%', width: '100%' }}>
        <ArtworkCardThreeDLabel className={ThreeDLabelStyles} />
        <MotionImage
          {...animationProps}
          loading="lazy"
          src={posterUrl}
          sx={{
            display: 'block',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    );
  }

  return (
    <MotionImage
      {...animationProps}
      loading="lazy"
      src={url}
      sx={{
        display: 'block',
        objectFit: 'cover',
        width: '100%',
        height: '100%',
      }}
    />
  );
}

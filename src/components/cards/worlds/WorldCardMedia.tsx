/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Image } from 'theme-ui';
import { css } from 'stitches.config';
import useIsInViewport from 'use-is-in-viewport';
import { AnimatePresence, motion } from 'framer-motion';

import CardVideo from 'components/cards/shared/CardVideo';

import { notEmptyOrNil } from 'utils/helpers';
import { isModel, isVideo } from 'utils/assets';
import { transitions } from 'utils/themes/main/theme';
import Model from 'components/model-media/Model';

const MotionImage = motion(Image);
const MotionCardVideo = motion(CardVideo);

interface WorldCardMediaProps {
  assetUrl: string;
  posterUrl?: string;
}

const modelStyles = css({
  width: '100%',
  height: '100%',
  backgroundColor: '$black10',
})();

export default function WorldCardMedia(
  props: WorldCardMediaProps
): JSX.Element {
  const { assetUrl, posterUrl } = props;

  const hasAssetUrl = notEmptyOrNil(assetUrl);

  const [isInViewport, targetRef] = useIsInViewport();

  if (hasAssetUrl) {
    return (
      <Box ref={targetRef} sx={{ height: '100%' }}>
        <AnimatePresence exitBeforeEnter>
          <RenderWorldCardMedia
            url={assetUrl}
            posterUrl={posterUrl}
            isInViewport={isInViewport}
          />
        </AnimatePresence>
      </Box>
    );
  }

  return null;
}

interface RenderWorldCardMediaProps {
  url: string;
  isInViewport: boolean;
  posterUrl?: string;
}

function RenderWorldCardMedia(props: RenderWorldCardMediaProps): JSX.Element {
  const { url, posterUrl, isInViewport } = props;

  const isUrlVideo = isVideo(url);
  const isUrlModel = isModel(url);

  const animationProps = {
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.1 },
  };

  if (!isInViewport && isUrlVideo) {
    return (
      <motion.div {...animationProps} sx={{ backgroundColor: 'black.5' }} />
    );
  }

  if (isUrlVideo) {
    return (
      <MotionCardVideo
        {...animationProps}
        posterUrl={posterUrl}
        url={url}
        sx={{
          transition: transitions.smooth.fast,
        }}
      />
    );
  }

  if (isUrlModel) {
    return <Model src={url} className={modelStyles} />;
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
        transition: transitions.smooth.fast,
      }}
    />
  );
}

/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, AspectRatio, Image, Box } from 'theme-ui';
import { memo, useEffect, useState, useRef } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import { AudioToggle, FullscreenToggle } from 'components/buttons/MediaButtons';
import MediaLoadingSpinner from 'components/media/MediaLoadingSpinner';

import {
  buildArtworkPageAssetUrl,
  buildPosterUrl,
  isVideo,
} from 'utils/assets';

import hasFullscreenSupport from 'utils/hasFullscreenSupport';

import Artwork, { BasicArtwork } from 'types/Artwork';
import { flexDirectionForPrefix, positionAbsolute } from 'types/styles';

interface ProductMediaProps {
  ratio?: number;
  artwork: BasicArtwork;
  controls?: boolean;
}

export const ProductMedia = memo<ProductMediaProps>((props) => {
  const media = <MediaOfAnyType {...props} />;

  const sxRatio = {
    bg: 'black.5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (props.ratio) {
    const ratio = props.ratio || 1 / 1;
    return (
      <AspectRatio ratio={ratio} sx={sxRatio}>
        {media}
      </AspectRatio>
    );
  } else {
    return media;
  }
});

interface MediaOfAnyTypeProps {
  artwork: BasicArtwork;
  controls?: boolean;
}

function MediaOfAnyType(props: MediaOfAnyTypeProps) {
  const { artwork, controls } = props;

  const assetUrl = buildArtworkPageAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const isAssetUrlVideo = isVideo(assetUrl);

  if (isAssetUrlVideo) {
    return (
      <MediaVideo
        assetUrl={assetUrl}
        posterUrl={posterUrl}
        controls={controls}
      />
    );
  }

  return <MediaImage imageUrl={assetUrl} controls={controls} />;
}

interface MediaImageProps {
  imageUrl: string;
  controls?: boolean;
}

export function MediaImage(props: MediaImageProps): JSX.Element {
  const { imageUrl, controls } = props;

  const fullscreenHandle = useFullScreenHandle();

  const handleFullscreen = () => {
    if (fullscreenHandle.active) {
      return fullscreenHandle.exit();
    }
    return fullscreenHandle.enter();
  };

  const sx = {
    fullscreenActiveWrapper: {
      backgroundColor: 'white.100',
      p: ['m', 'xl'],
    },
    fullscreenControls: {
      position: positionAbsolute,
      bottom: 's',
      right: 's',
      display: 'flex',
      flexDirection: flexDirectionForPrefix,
    },
    mediaControls: {
      position: positionAbsolute,
      bottom: 0,
      right: 0,
      pr: 'm',
      pb: 'xl',
    },
  };

  return (
    <>
      <FullScreen
        handle={fullscreenHandle}
        sx={{
          position: 'relative',
          mx: 'auto',
          ...(fullscreenHandle.active && sx.fullscreenActiveWrapper),
        }}
      >
        <Image
          src={imageUrl}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            cursor: fullscreenHandle.active ? 'default' : 'zoom-in',
          }}
          onClick={() => {
            if (
              !fullscreenHandle.active &&
              controls &&
              hasFullscreenSupport()
            ) {
              return fullscreenHandle.enter();
            }
          }}
        />

        {fullscreenHandle.active && (
          <Box sx={sx.fullscreenControls}>
            <FullscreenToggle
              onClick={handleFullscreen}
              isFullscreen={fullscreenHandle.active}
            />
          </Box>
        )}
      </FullScreen>

      {controls && (
        <Box sx={sx.mediaControls}>
          <FullscreenToggle
            sx={{ ml: 'xs' }}
            onClick={handleFullscreen}
            isFullscreen={fullscreenHandle.active}
          />
        </Box>
      )}
    </>
  );
}

interface MediaVideoProps {
  assetUrl: string;
  posterUrl?: string;
  className?: string;
  controls?: boolean;
}

export function MediaVideo(props: MediaVideoProps): JSX.Element {
  const { assetUrl, posterUrl, controls, className } = props;

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fullscreenHandle = useFullScreenHandle();

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoObj = videoRef.current;

    const checkAudio = () => {
      const hasAudioChecks =
        Boolean(videoObj?.mozHasAudio) ||
        Boolean(videoObj?.webkitAudioDecodedByteCount) ||
        Boolean(videoObj?.audioTracks?.length);

      setHasAudio(hasAudioChecks);
    };

    const disableLoading = () => {
      setIsLoading(false);
    };

    videoObj.addEventListener('loadeddata', checkAudio);
    // Have to use timeupdate as sometimes 'play' event is missed due to timings, this fires mutliple times so will get it at least once
    if (isLoading) {
      videoObj.addEventListener('timeupdate', disableLoading);
    } else {
      videoObj.removeEventListener('timeupdate', disableLoading);
    }

    return () => {
      videoObj.removeEventListener('loadeddata', checkAudio);
      videoObj.removeEventListener('timeupdate', disableLoading);
    };
  }, [videoRef, isLoading]);

  const handleMute = () => {
    if (videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleFullscreen = () => {
    if (fullscreenHandle.active) {
      return fullscreenHandle.exit();
    }
    return fullscreenHandle.enter();
  };

  const sx = {
    mediaWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    loading: {
      position: positionAbsolute,
      display: 'flex',
      alignItems: 'center',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      p: 'xs',
      backgroundColor: 'white.100',
      boxShadow: 'm',
      borderRadius: 999,
      opacity: 0.7,
    },
    video: {
      width: '100%',
      height: '100%',
      mx: 'auto',
      transition: 'filter 0.3s ease-in-out',
      cursor: fullscreenHandle.active || !controls ? 'default' : 'zoom-in',
      filter: [
        'drop-shadow(0 5px 8px rgba(0, 0, 0, 0.25))',
        `drop-shadow(0 20px 20px rgba(0, 0, 0, 0.25)) ${
          isLoading ? 'blur(10px)' : ''
        }`,
      ],
    },
    fullscreenActiveWrapper: {
      backgroundColor: 'white.100',
      p: ['m', 'xl'],
    },
    fullscreenControls: {
      position: positionAbsolute,
      bottom: 's',
      right: 's',
      display: 'flex',
      flexDirection: flexDirectionForPrefix,
    },
    mediaControls: {
      position: positionAbsolute,
      bottom: 0,
      right: 0,
      pr: 'm',
      pb: 'xl',
    },
  };

  return (
    <Box sx={sx.mediaWrapper} className={className}>
      <FullScreen
        handle={fullscreenHandle}
        sx={{
          display: 'flex',
          position: 'relative',
          ...(fullscreenHandle.active && sx.fullscreenActiveWrapper),
        }}
      >
        <video
          ref={videoRef}
          sx={sx.video}
          src={assetUrl}
          poster={posterUrl}
          loop
          autoPlay
          muted
          playsInline
          onClick={() => {
            if (
              !fullscreenHandle.active &&
              controls &&
              hasFullscreenSupport()
            ) {
              return fullscreenHandle.enter();
            }
          }}
        />

        <MediaLoadingSpinner isLoading={isLoading} size={32} />

        {fullscreenHandle.active && (
          <Box sx={sx.fullscreenControls}>
            {hasAudio && (
              <AudioToggle
                isMuted={isMuted}
                onClick={handleMute}
                sx={{ mb: 'xs' }}
              />
            )}
            <FullscreenToggle
              onClick={handleFullscreen}
              isFullscreen={fullscreenHandle.active}
            />
          </Box>
        )}
      </FullScreen>

      {controls && (
        <Box sx={sx.mediaControls}>
          {hasAudio && <AudioToggle isMuted={isMuted} onClick={handleMute} />}
          <FullscreenToggle
            sx={{ ml: 'xs' }}
            onClick={handleFullscreen}
            isFullscreen={fullscreenHandle.active}
          />
        </Box>
      )}
    </Box>
  );
}

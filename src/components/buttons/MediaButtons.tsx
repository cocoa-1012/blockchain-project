/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { useState, useEffect } from 'react';

import hasFullscreenSupport from 'utils/hasFullscreenSupport';

import Muted from 'assets/icons/muted.svg';
import Unmuted from 'assets/icons/unmuted.svg';
import Fullscreen from 'assets/icons/fullscreen.svg';
import ExitFullscreen from 'assets/icons/exit-fullscreen.svg';

export interface AudioToggleProps {
  className?: string;
  onClick: () => void;
  isMuted: boolean;
}

export function AudioToggle(props: AudioToggleProps): JSX.Element {
  const { className, onClick, isMuted } = props;
  return (
    <Box
      as="button"
      sx={{
        appearance: 'none',
        backgroundColor: 'rgba(0,0,0,0.5)',
        border: 'none',
        borderRadius: 999,
        height: 38,
        width: 38,
        p: 0,
        cursor: 'pointer',
        outline: 'none',
      }}
      className={className}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex' }}>
        {isMuted ? (
          <Muted sx={{ width: 18, height: '100%', mx: 'auto' }} />
        ) : (
          <Unmuted sx={{ width: 19, height: '100%', mx: 'auto' }} />
        )}
      </Box>
    </Box>
  );
}

export interface FullscreenToggleProps {
  className?: string;
  onClick: () => void;
  isFullscreen: boolean;
}

export function FullscreenToggle(props: FullscreenToggleProps): JSX.Element {
  const { className, onClick, isFullscreen } = props;
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  useEffect(() => {
    const supportsFullscreen = hasFullscreenSupport();

    setFullscreenSupported(supportsFullscreen);
  }, []);

  if (!fullscreenSupported) {
    return null;
  }

  return (
    <Box
      as="button"
      sx={{
        appearance: 'none',
        backgroundColor: 'rgba(0,0,0,0.5)',
        border: 'none',
        borderRadius: 999,
        height: 38,
        width: 38,
        p: 0,
        cursor: 'pointer',
        outline: 'none',
      }}
      className={className}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex' }}>
        {isFullscreen ? (
          <ExitFullscreen sx={{ width: 16, height: '100%', mx: 'auto' }} />
        ) : (
          <Fullscreen sx={{ width: 16, height: '100%', mx: 'auto' }} />
        )}
      </Box>
    </Box>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { ReactNode } from 'react';
import { jsx, Box } from 'theme-ui';

import { positionRelative } from 'types/styles';

import { transitions } from 'utils/themes/main/theme';

interface ArtworkCardContainerProps {
  children: ReactNode;
  className?: string;
  isHovered?: boolean;
}

export default function ArtworkCardContainer(
  props: ArtworkCardContainerProps
): JSX.Element {
  const { children, className, isHovered } = props;

  return (
    <Box
      sx={{
        backgroundColor: 'white.100',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: isHovered ? 'm' : 's',
        transition: transitions.smooth.fast,
        cursor: 'pointer',
        transform: isHovered
          ? 'translate3d(0,-4px, 0)'
          : 'translate3d(0, 0, 0)',
        willChange: 'transform',
        position: positionRelative,
      }}
      className={className}
    >
      {children}
    </Box>
  );
}

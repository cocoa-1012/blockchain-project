/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, ThemeUIStyleObject } from 'theme-ui';
import { ReactNode } from 'react';

import { transitions } from 'utils/themes/main/theme';

interface HoverableProps {
  y?: number;
  children: ReactNode;
  className?: string;
  hoverStyles?: ThemeUIStyleObject;
}

export default function Hoverable(props: HoverableProps): JSX.Element {
  const { children, className, hoverStyles, y = -2 } = props;
  return (
    <Box
      className={className}
      sx={{
        transition: transitions.smooth.fast,
        willChange: 'transform, box-shadow',
        '@media (hover: hover)': {
          '&:hover': {
            ...hoverStyles,
            transform: `translateY(${y}px)`,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {children}
    </Box>
  );
}

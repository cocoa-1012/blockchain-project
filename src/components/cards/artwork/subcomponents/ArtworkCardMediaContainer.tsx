/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, AspectRatio } from 'theme-ui';
import { forwardRef, ReactNode } from 'react';

interface ArtworkCardMediaContainerProps {
  children: ReactNode;
}

const ArtworkCardMediaContainer = forwardRef<
  HTMLDivElement,
  ArtworkCardMediaContainerProps
>(
  (props, ref): JSX.Element => {
    const { children } = props;

    return (
      <AspectRatio
        ref={ref}
        ratio={1 / 1}
        sx={{
          bg: 'black.5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </AspectRatio>
    );
  }
);

export default ArtworkCardMediaContainer;

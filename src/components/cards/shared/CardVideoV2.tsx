/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { ForwardedRef, MutableRefObject } from 'react';
import { jsx } from 'theme-ui';

interface CardVideoProps {
  url: string;
  posterUrl: string;
  className?: string;
}

export default function CardVideo(props: CardVideoProps): JSX.Element {
  const { url, posterUrl } = props;

  return (
    <video
      loop
      src={url}
      poster={posterUrl}
      autoPlay
      muted
      playsInline
      sx={{
        display: 'block',
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        maxHeight: '1000px',
      }}
    />
  );
}

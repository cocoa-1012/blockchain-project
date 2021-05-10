/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useRef, forwardRef, MutableRefObject } from 'react';

import ErrorBoundaryNoLogs from 'components/ErrorBoundaryNoLogs';

interface CardVideoProps {
  url: string;
  posterUrl: string;
  className?: string;
}

const ErrorBoundaryCardVideo = forwardRef(function (
  props: CardVideoProps,
  ref: MutableRefObject<HTMLElement>
): JSX.Element {
  return (
    <ErrorBoundaryNoLogs errorView={<CardVideo {...props} />}>
      <CardVideo {...props} />
    </ErrorBoundaryNoLogs>
  );
});

function CardVideo(props: CardVideoProps): JSX.Element {
  const { url, posterUrl, className } = props;

  const videoRef = useRef(null);

  return (
    <AnimatePresence>
      <motion.video
        ref={videoRef}
        className={className}
        loop
        // the key duplicates the element when the URL changes
        // meaning we can fade cleanly between ipfs -> optimised videos
        key={url}
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
          position: 'absolute',
        }}
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, type: 'tween' }}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onError={() => {}}
      />
    </AnimatePresence>
  );
}

export default memo<CardVideoProps>(ErrorBoundaryCardVideo);

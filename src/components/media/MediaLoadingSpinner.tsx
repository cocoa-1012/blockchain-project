/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { AnimatePresence, motion } from 'framer-motion';

import SpinnerStroked from 'components/SpinnerStroked';

import { positionAbsolute } from 'types/styles';

const animationProps = {
  initial: { opacity: 0 },
  exit: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.1, duration: 0.2 },
};

interface MediaLoadingSpinnerProps {
  isLoading: boolean;
  size?: number;
}

export default function MediaLoadingSpinner(
  props: MediaLoadingSpinnerProps
): JSX.Element {
  const { isLoading, size } = props;
  return (
    <AnimatePresence initial={false}>
      {isLoading && (
        <motion.div {...animationProps}>
          <Box
            sx={{
              position: positionAbsolute,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white.100',
            }}
          >
            <SpinnerStroked size={size} />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

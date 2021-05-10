/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';
import { AnimatePresence, motion } from 'framer-motion';

import SpinnerStroked from 'components/SpinnerStroked';
import { getStatusTagStyles } from '../styles';

interface ArtworkCardOptimizingProps {
  className?: string;
  isVisible: boolean;
}

export default function ArtworkCardOptimizing(
  props: ArtworkCardOptimizingProps
): JSX.Element {
  const { className, isVisible } = props;

  const sx = getStatusTagStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          sx={{ ...sx.tag, paddingY: 9, paddingX: 10 }}
          className={className}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: [1, 0, 0], y: -20 }}
          transition={{
            duration: 0.35,
            type: 'spring',
          }}
        >
          <Box>
            <SpinnerStroked size={14} />
          </Box>
          <Text variant="h.body" sx={{ marginLeft: 'xs' }}>
            Processing…
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

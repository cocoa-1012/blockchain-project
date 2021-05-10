import React from 'react';
import { motion } from 'framer-motion';

interface PulseProps {
  size?: number;
  className?: string;
}

export default function Pulse(props: PulseProps): JSX.Element {
  const { size = 10, className } = props;

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: 'black',
        borderRadius: 999,
      }}
      animate={{ opacity: [1, 0], scale: [0.95, 1] }}
      transition={{
        ease: 'easeInOut',
        repeat: Infinity,
        duration: 1.5,
      }}
      className={className}
    />
  );
}

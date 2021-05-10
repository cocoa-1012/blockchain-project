import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ComponentTransitionProps {
  children: ReactNode;
  y?: number;
  duration?: number;
}

export default function ComponentTransition(
  props: ComponentTransitionProps
): JSX.Element {
  const { children, y = 10, duration = 0.15 } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import Box from 'components/base/Box';
import Icon from 'components/Icon';

import ValidIcon from 'assets/icons/input-check-icon.svg';
import ErrorIcon from 'assets/icons/error-icon.svg';

interface PopUpProps {
  children: ReactNode;
}

function PopUp(props: PopUpProps): JSX.Element {
  const { children } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2, delay: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

interface ValidationStatesProps {
  isValid: boolean;
  hasError?: boolean;
  className?: string;
}

export function ValidationStates(props: ValidationStatesProps): JSX.Element {
  const { hasError, className, isValid } = props;

  return (
    <Box
      className={className}
      css={{
        pointerEvents: 'none',
        position: 'absolute',
        top: '50%',
        right: '$4',
        transform: 'translateY(-50%)',
      }}
    >
      {hasError && (
        <PopUp>
          <Icon icon={ErrorIcon} width={30} height={30} />
        </PopUp>
      )}
      {isValid && (
        <PopUp>
          <ValidIcon style={{ display: 'block' }} />
        </PopUp>
      )}
    </Box>
  );
}

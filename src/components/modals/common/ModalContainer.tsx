/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { DialogOverlay } from '@reach/dialog';
import { ReactNode, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';

const MotionDialogOverlay = motion(DialogOverlay);
interface ModalContainerProps {
  children: ReactNode;
  className?: string;
  modalKey: ModalKey;
  blockOverlayDismiss?: boolean;
}

export default function ModalContainer(
  props: ModalContainerProps
): JSX.Element {
  const { children, className, modalKey, blockOverlayDismiss } = props;

  const { currentModal, resetModal } = useModal();

  const isOpen = modalKey === currentModal;

  const onDismiss = useCallback(() => {
    if (blockOverlayDismiss) {
      return;
    }
    resetModal();
  }, [resetModal, blockOverlayDismiss]);

  return (
    <AnimatePresence exitBeforeEnter>
      {isOpen && (
        <MotionDialogOverlay
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              when: 'beforeChildren',
              duration: 0.2,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              when: 'afterChildren',
              duration: 0.2,
            },
          }}
          transition={{
            type: 'tween',
          }}
          sx={{
            background: 'rgba(0, 0, 0, 0.8)',
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            overflow: 'auto',
            paddingLeft: ['s', 32],
            paddingRight: ['s', 32],
            zIndex: 999,
            display: 'flex',
          }}
          onDismiss={onDismiss}
          className={className}
        >
          {children}
        </MotionDialogOverlay>
      )}
    </AnimatePresence>
  );
}

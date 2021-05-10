/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { ReactNode } from 'react';
import { DialogContent } from '@reach/dialog';
import { motion } from 'framer-motion';
interface ModalContentProps {
  children?: ReactNode;
  className?: string;
}

const MotionDialogContent = motion(DialogContent);

export default function ModalContent(props: ModalContentProps): JSX.Element {
  const { children, className } = props;
  return (
    <MotionDialogContent
      aria-label="Modal"
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1,
          duration: 0.1,
        },
      }}
      exit={{
        opacity: 0,
        y: 15,
        transition: {
          delay: 0,
          duration: 0.5,
        },
      }}
      transition={{ duration: 0.1, type: 'tween' }}
      sx={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: 's',
        backgroundColor: 'white.100',
        padding: ['m', null, 'l'],
        maxWidth: 400,
        width: '100%',
        margin: 'auto',
        borderRadius: 24,
      }}
      className={className}
    >
      {children}
    </MotionDialogContent>
  );
}

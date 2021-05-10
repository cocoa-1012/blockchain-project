/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject } from 'theme-ui';

import { ReactNode } from 'react';

import ModalContent from 'components/modals/common/ModalContent';

interface ModalContentVirtualizedProps {
  children: ReactNode;
}

export default function ModalContentVirtualized(
  props: ModalContentVirtualizedProps
): JSX.Element {
  const { children } = props;

  const sx = getStyles();

  return <ModalContent sx={sx.container}>{children}</ModalContent>;
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    maxWidth: 760,
    minHeight: 640,
    maxHeight: 640,
    padding: [0, 0, 0],
    overflow: 'auto',
    justifyContent: 'flex-start',
    backgroundColor: 'white.100',
    position: 'relative',
  };

  return { container };
};

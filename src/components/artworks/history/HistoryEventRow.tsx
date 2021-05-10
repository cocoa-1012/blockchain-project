/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, ThemeUIStyleObject } from 'theme-ui';
import { ReactNode } from 'react';

interface HistoryEventRowProps {
  children: ReactNode;
}

export default function HistoryEventRow(
  props: HistoryEventRowProps
): JSX.Element {
  const { children } = props;

  const sx = getStyles();

  return <Flex sx={sx.container}>{children}</Flex>;
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    paddingX: [20, 'm'],
    paddingY: 20,
    borderRadius: 12,
    alignItems: ['flex-start', 'center'],
    backgroundColor: 'white.100',
    position: 'relative',
    '&::before': {
      content: '""',
      boxShadow: 's',
      borderRadius: 12,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -2,
    },
  };
  return { container };
};

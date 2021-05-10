/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';

import { ReactNode } from 'react';

interface AuthContainerProps {
  children: ReactNode;
  className?: string;
}

export default function AuthContainer(props: AuthContainerProps): JSX.Element {
  const { children, className } = props;

  const sx = getStyles();

  return (
    <Flex sx={sx.container} className={className}>
      <Flex sx={sx.inner}>{children}</Flex>
    </Flex>
  );
}

const getStyles = () => ({
  container: {
    width: '100%',
    flex: 'auto',
  },
  inner: {
    paddingY: ['m', 'l', 'xl', 'xxl'],
    flex: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';

import SpinnerStroked from './SpinnerStroked';

interface LoadingPageProps {
  className?: string;
}

export default function LoadingPage(props: LoadingPageProps): JSX.Element {
  const { className } = props;
  return (
    <Flex
      className={className}
      sx={{
        flex: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 'xxxl',
      }}
    >
      <SpinnerStroked size={44} />
    </Flex>
  );
}

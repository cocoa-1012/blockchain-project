/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

import FNDLogo from 'assets/images/fnd-logo.svg';

interface LogoProps {
  width: number | number[];
  className?: string;
}

export default function Logo(props: LogoProps): JSX.Element {
  const { width = [75, 98], className } = props;
  return (
    <Box sx={{ paddingBottom: '33.6734694%', height: 0, width }}>
      <FNDLogo className={className} />
    </Box>
  );
}

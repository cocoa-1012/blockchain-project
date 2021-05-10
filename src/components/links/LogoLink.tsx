/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

import Link from 'components/links/Link';
import Logo from 'components/Logo';

interface LogoLinkProps {
  width?: number | number[];
  className?: string;
  color?: string;
}

export default function LogoLink(props: LogoLinkProps): JSX.Element {
  const { color, className, width = [75, 98] } = props;
  return (
    <Link href="/">
      <Box as="a" sx={{ color, display: 'block' }} className={className}>
        <Logo sx={{ display: 'block' }} width={width} />
      </Box>
    </Link>
  );
}

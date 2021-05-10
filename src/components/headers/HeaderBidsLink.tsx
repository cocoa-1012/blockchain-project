/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text, Grid } from 'theme-ui';

import { transitions } from 'utils/themes/main/theme';

import Link from 'components/links/Link';
import HeaderBidsCount from './HeaderBidsCount';

interface HeaderBidsLinkProps {
  className?: string;
  bidCount: number;
}

export default function HeaderBidsLink(
  props: HeaderBidsLinkProps
): JSX.Element {
  const { className, bidCount } = props;

  return (
    <Box className={className}>
      <Link href="/bids">
        <a
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            transition: transitions.smooth.fast,
            '@media (hover: hover)': {
              '&:hover': {
                '& .number-bg': {
                  opacity: 0.3,
                },
              },
            },
          }}
        >
          <Text variant="h.xs">Bids</Text>
          {bidCount > 0 && <HeaderBidsCount count={bidCount} />}
        </a>
      </Link>
    </Box>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Link, Text } from 'theme-ui';
import { ReactNode } from 'react';

import { transitions } from 'utils/themes/main/theme';

interface ExternalLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: string;
}

export default function ExternalLink(props: ExternalLinkProps): JSX.Element {
  const { href, children, className, variant = 'h.body' } = props;

  const sx = getStyles();

  return (
    <Link href={href} rel="noopener noreferrer" target="_blank">
      <Text variant={variant} sx={sx.link} className={className}>
        {children}
      </Text>
    </Link>
  );
}

const getStyles = () => ({
  link: {
    color: 'black.60',
    transition: transitions.smooth.fast,
    cursor: 'pointer',
    '@media (hover: hover)': {
      '&:hover': {
        color: 'black.100',
      },
    },
  },
});

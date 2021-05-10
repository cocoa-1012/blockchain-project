/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Link, Text } from 'theme-ui';
import { ReactNode } from 'react';

import { transitions } from 'utils/themes/main/theme';

interface ExternalInlineLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: string;
}

export default function ExternalInlineLink(
  props: ExternalInlineLinkProps
): JSX.Element {
  const { href, children, className, variant = 'h.body' } = props;

  const sx = getStyles();

  return (
    <Link
      className={className}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      sx={sx.link}
    >
      {children}
    </Link>
  );
}

const getStyles = () => ({
  link: {
    color: 'black.60',
    transition: transitions.smooth.fast,
    fontFamily: 'body',
    fontWeight: 600,
    fontSize: 'body',
    cursor: 'pointer',
    '@media (hover: hover)': {
      '&:hover': {
        color: 'black.100',
      },
    },
  },
});

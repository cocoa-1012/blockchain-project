/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

import { transitions } from 'utils/themes/main/theme';

import Link from './Link';

interface InternalLinkProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  variant?: string;
}

export default function InternalLink(props: InternalLinkProps): JSX.Element {
  const {
    href,
    children,
    className,
    target,
    variant = 'h.body',
    onClick,
  } = props;

  const sx = getStyles();

  if (onClick) {
    return (
      <Text
        variant={variant}
        sx={sx.link}
        className={className}
        onClick={onClick}
      >
        {children}
      </Text>
    );
  }

  return (
    <Link href={href}>
      <a sx={{ textDecoration: 'none' }} className={className} target={target}>
        <Text variant={variant} sx={sx.link} className={className}>
          {children}
        </Text>
      </a>
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

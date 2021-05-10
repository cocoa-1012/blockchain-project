/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject } from 'theme-ui';

import OpenLinkIcon from 'assets/icons/open-link-icon.svg';

import { transitions } from 'utils/themes/main/theme';

interface EtherscanIconLinkProps {
  href: string;
  className?: string;
}

export default function EtherscanIconLink(
  props: EtherscanIconLinkProps
): JSX.Element {
  const { href, className } = props;
  return (
    <a
      sx={sx}
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="View on Etherscan"
    >
      <OpenLinkIcon sx={{ display: 'block' }} width={16} height={16} />
    </a>
  );
}

const sx: ThemeUIStyleObject = {
  overflow: 'hidden',
  color: 'black.30',
  cursor: 'pointer',
  transition: transitions.smooth.fast,
  willChange: 'transform',
  '@media (hover: hover)': {
    '&:hover': {
      color: 'black.100',
    },
  },
};

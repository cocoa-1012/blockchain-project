/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box } from 'theme-ui';
import { AnchorHTMLAttributes, ReactNode } from 'react';

import { transitions } from 'utils/themes/main/theme';

import OpenLinkIcon from 'assets/icons/open-link-icon.svg';

interface ExternalShadowLinkProps {
  children: ReactNode;
  icon: ReactNode;
  href: string;
  anchorAttributes?: AnchorHTMLAttributes<HTMLAnchorElement>;
  className?: string;
}

export default function ExternalShadowLink(
  props: ExternalShadowLinkProps
): JSX.Element {
  const { children, icon, href, className, anchorAttributes } = props;

  return (
    <a
      {...anchorAttributes}
      className={className}
      href={href}
      sx={{
        backgroundColor: 'white.100',
        position: 'relative',
        display: 'flex',
        boxShadow: 's',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        transition: transitions.smooth.fast,
        willChange: 'transform, boxShadow',
        textDecoration: 'none',
        color: 'black.30',
        cursor: 'pointer',
        '@media (hover: hover)': {
          '&:hover': {
            boxShadow: 'm',
            transform: 'translateY(-2px)',
            color: 'black.100',
          },
        },
      }}
    >
      <span sx={{ color: 'black.100', minWidth: 40 }}>{icon}</span>

      <Text variant="h.body" sx={{ color: 'black.100' }}>
        {children}
      </Text>
      <Box sx={{ marginLeft: 'auto' }}>
        <OpenLinkIcon sx={{ display: 'block' }} width={16} height={16} />
      </Box>
    </a>
  );
}

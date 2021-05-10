/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { ReactNode } from 'react';

import InternalLink from './InternalLink';

interface InternalInlineLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: string;
  target?: string;
}

// Note: Note quite using the styling as desired yet
// TODO: Fix this before using
export default function InternalInlineLink(
  props: InternalInlineLinkProps
): JSX.Element {
  const { href, children, className, target, variant = 'h.body' } = props;

  return (
    <InternalLink
      href={href}
      className={className}
      variant={variant}
      target={target}
      sx={{ display: 'inline' }}
    >
      {children}
    </InternalLink>
  );
}

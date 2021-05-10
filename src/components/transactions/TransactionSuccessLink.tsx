/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Button } from 'theme-ui';
import { ReactNode } from 'react';

import Link from 'components/links/Link';

import { pointerEventsAuto, pointerEventsNone } from 'types/styles';
import { ListArtworkPath } from './mint/types';

interface TransactionSuccessLinkProps {
  href?: string | ListArtworkPath;
  isLoading?: boolean;
  children: ReactNode;
  variant: 'primary' | 'outline';
  className?: string;
}

export default function TransactionSuccessLink({
  href,
  isLoading = false,
  children,
  variant,
  className,
}: TransactionSuccessLinkProps): JSX.Element {
  if (href) {
    return (
      <Link href={href}>
        <a
          sx={{
            display: 'block',
            pointerEvents: isLoading ? pointerEventsNone : pointerEventsAuto,
          }}
        >
          <Button
            variant={variant}
            className={className}
            disabled={isLoading}
            sx={{ width: '100%', paddingX: ['s', 's', 's'] }}
          >
            {children}
          </Button>
        </a>
      </Link>
    );
  }

  return null;
}

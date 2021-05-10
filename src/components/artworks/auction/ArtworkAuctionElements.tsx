/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { forwardRef, ReactNode } from 'react';
import { jsx, Grid } from 'theme-ui';

interface ArtworkAuctionContainerProps {
  children: ReactNode;
}

export const ArtworkAuctionContainer = forwardRef<
  HTMLDivElement,
  ArtworkAuctionContainerProps
>(
  (props, ref): JSX.Element => {
    const { children } = props;
    return (
      <Grid
        gap="l"
        ref={ref}
        sx={{
          boxShadow: 's',
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          position: 'relative',
        }}
      >
        {children}
      </Grid>
    );
  }
);

export function ArtworkAuctionContainerSmall(
  props: ArtworkAuctionContainerProps
): JSX.Element {
  const { children } = props;
  return (
    <Grid
      gap="m"
      sx={{
        boxShadow: 's',
        marginTop: -20,
        paddingY: 20,
        borderRadius: 10,
        width: 560,
        // zIndex: -3,
      }}
    >
      {children}
    </Grid>
  );
}

interface ArtworkAuctionMetaContainerProps {
  children: ReactNode;
  isNarrow: boolean;
  className?: string;
}

export function ArtworkAuctionMetaContainer(
  props: ArtworkAuctionMetaContainerProps
): JSX.Element {
  const { children, isNarrow, className } = props;
  return (
    <Grid
      className={className}
      sx={{ paddingX: 'l', paddingTop: 'l' }}
      columns={isNarrow ? 1 : 'auto 1fr'}
      gap={isNarrow ? 'm' : 'xl'}
    >
      {children}
    </Grid>
  );
}

export function ArtworkAuctionMetaContainerSmall(
  props: ArtworkAuctionMetaContainerProps
): JSX.Element {
  const { children, isNarrow, className } = props;
  return (
    <Grid
      className={className}
      sx={{ paddingX: 'l', paddingTop: 'l', zIndex: -3 }}
      columns={isNarrow ? 1 : 'auto 1fr'}
      gap={isNarrow ? 'm' : 'xl'}
    >
      {children}
    </Grid>
  );
}

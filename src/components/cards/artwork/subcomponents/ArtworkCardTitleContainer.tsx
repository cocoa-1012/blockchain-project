/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { ReactNode } from 'react';

interface ArtworkCardTitleContainerProps {
  children: ReactNode;
}

export default function ArtworkCardTitleContainer(
  props: ArtworkCardTitleContainerProps
): JSX.Element {
  const { children } = props;

  return (
    <Grid
      gap="m"
      sx={{
        boxShadow: 's',
        padding: 'm',
        flex: 'auto',
      }}
    >
      {children}
    </Grid>
  );
}

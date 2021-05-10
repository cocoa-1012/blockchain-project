/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { ReactNode } from 'react';

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

export default function CardGrid(props: CardGridProps): JSX.Element {
  const { children, className } = props;
  return (
    <Grid
      className={className}
      gap={['s', 'm', 'l']}
      columns={[1, 2, 3, null, 4]}
    >
      {children}
    </Grid>
  );
}

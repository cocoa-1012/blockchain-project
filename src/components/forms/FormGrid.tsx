/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { ReactNode } from 'react';

interface FormGridProps {
  children: ReactNode;
}

export default function FormGrid(props: FormGridProps): JSX.Element {
  const { children } = props;
  return (
    <Grid
      gap="m"
      sx={{
        paddingTop: ['m', 'l', 'xxl', 'xxxl'],
        paddingBottom: ['m', 'l', 'xxl', 'xxxl', 'xxxxl'],
        paddingX: [null, null, 'xl'],
      }}
    >
      {children}
    </Grid>
  );
}

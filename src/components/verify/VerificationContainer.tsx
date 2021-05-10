/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box } from 'theme-ui';
import { ReactNode } from 'react';

import Body from 'components/Body';

interface VerificationContainerProps {
  children: ReactNode;
  className?: string;
}

export default function VerificationContainer(
  props: VerificationContainerProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Grid
      sx={{
        flex: 'auto',
        alignItems: 'center',
        marginX: 'auto',
        gridTemplateColumns: '340px 400px',
        gap: 'xxxl',
      }}
      className={className}
    >
      <Box>{children}</Box>
    </Grid>
  );
}

interface VerificationFormContainerProps {
  children: ReactNode;
  className?: string;
}

export function VerificationFormContainer(
  props: VerificationFormContainerProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Body
      className={className}
      sx={{
        display: 'grid',
        flex: 'auto',
        alignItems: 'center',
        maxWidth: 800,
        paddingBottom: 'l',
      }}
    >
      {children}
    </Body>
  );
}

export function VerificationLaterStateContainer(
  props: VerificationFormContainerProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Body
      className={className}
      sx={{
        display: 'grid',
        flex: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 800,
        paddingBottom: 'l',
      }}
    >
      {children}
    </Body>
  );
}

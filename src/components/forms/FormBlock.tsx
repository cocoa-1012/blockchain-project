/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box, Heading } from 'theme-ui';
import { useMeasure } from 'react-use';
import { ReactNode } from 'react';

import VerifiedBadge from 'assets/icons/verified-badge.svg';

interface FormBlockProps {
  children: ReactNode;
  title: string;
  className?: string;
  hintText?: ReactNode;
  shouldShowBadge?: boolean;
}

export default function FormBlock(props: FormBlockProps): JSX.Element {
  const {
    children,
    title,
    className,
    hintText,
    shouldShowBadge = false,
  } = props;

  const [measureRef, { width }] = useMeasure();
  const isNarrow = width <= 620;

  return (
    <Box className={className}>
      {shouldShowBadge && (
        <VerifiedBadge
          key="verified"
          style={{ display: 'block' }}
          width={50}
          height={50}
          className="verified-icon"
          sx={{ marginBottom: 'm' }}
        />
      )}
      <Box ref={measureRef} />
      <Grid
        columns={isNarrow ? null : '250px auto'}
        gap={isNarrow ? null : 'xxl'}
      >
        <Box>
          <Heading variant="h.s" sx={{ mb: ['m'] }}>
            {title}
          </Heading>
          {hintText}
        </Box>
        <Box>{children}</Box>
      </Grid>
    </Box>
  );
}

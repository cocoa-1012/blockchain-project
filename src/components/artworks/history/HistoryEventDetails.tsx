/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text, ThemeUIStyleObject } from 'theme-ui';
import { ReactNode } from 'react';

import HistoryEventDate from './HistoryEventDate';

interface HistoryEventDetailsProps {
  date: string;
  children: ReactNode;
  className?: string;
}

export default function HistoryEventDetails(
  props: HistoryEventDetailsProps
): JSX.Element {
  const { children, date, className } = props;

  const sx = getStyles();

  return (
    <Grid sx={sx.container} className={className}>
      <Text variant="h.body" sx={{ fontSize: 'inherit' }}>
        {children}
      </Text>

      <HistoryEventDate date={date} />
    </Grid>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    lineHeight: 1.4,
    marginRight: ['l', 0],
    gap: [5, 2],
  };

  return { container };
};

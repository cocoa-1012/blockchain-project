/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text, Heading, Box, ThemeUIStyleObject } from 'theme-ui';

import { ReactNode } from 'react';

interface TransactionContentProps {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}

export default function TransactionContent(
  props: TransactionContentProps
): JSX.Element {
  const { description, title, children } = props;

  const sx = getStyles();

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Grid gap="s">
        <Heading variant="h.l" sx={sx.heading}>
          {title}
        </Heading>
        <Grid gap="l" sx={sx.description}>
          <Text variant="body.body">{description}</Text>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}

const getStyles = () => {
  const heading: ThemeUIStyleObject = {
    lineHeight: 1,
    textAlign: ['center', null, 'left'],
  };

  const description: ThemeUIStyleObject = {
    justifyContent: ['center', null, 'flex-start'],
    textAlign: ['center', null, 'left'],
  };

  return { heading, description };
};

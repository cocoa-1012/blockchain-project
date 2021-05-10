/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text, Button, Box, ThemeUIStyleObject } from 'theme-ui';

import TransactionContent from './TransactionContent';

interface TransactionError {
  message: string;
  operation?: string;
}

interface TransactionErrorProps {
  error: TransactionError;
  resetTransaction: () => void;
}

export function TransactionError(props: TransactionErrorProps): JSX.Element {
  const { error, resetTransaction } = props;

  const sx = getStyles();

  // console.log({ error });

  // TODO: DRY this up with the component above
  let errorMsg: string;
  if (error?.operation === 'getAddress') {
    errorMsg = 'You need to enter your password in MetaMask first.';
  }

  return (
    <TransactionContent
      title="There was an error with your transaction."
      description="There was an error with your transaction."
    >
      <Grid gap="m">
        <Box sx={{ overflow: 'scroll', maxHeight: 220 }}>
          <Text variant="body.body" sx={sx.error}>
            {errorMsg ?? error.message.toString()}
          </Text>
        </Box>

        <Box sx={{ maxWidth: 300 }}>
          <Button onClick={resetTransaction} sx={{ width: '100%' }}>
            Retry
          </Button>
        </Box>
      </Grid>
    </TransactionContent>
  );
}

const getStyles = () => {
  const error: ThemeUIStyleObject = {
    fontFamily: 'mono',
    color: 'utility.red',
    fontSize: 'sub',
    lineHeight: 1.75,
  };

  return { error };
};

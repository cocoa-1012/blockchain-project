/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';

import TransactionContent from '../TransactionContent';

interface ApproveViewProps {
  onSubmit: () => void;
}

export default function ApproveView(props: ApproveViewProps): JSX.Element {
  const { onSubmit } = props;

  const sx = getStyles();

  return (
    <TransactionContent
      title="Please approve the auction contract."
      description="Approve this one-time transaction to give your wallet the ability to list NFTs that have been minted on Foundation for auction."
    >
      <Box sx={{ maxWidth: 260 }}>
        <Button sx={sx.button} onClick={onSubmit}>
          Approve
        </Button>
      </Box>
    </TransactionContent>
  );
}

const getStyles = () => ({
  button: { width: '100%' },
});

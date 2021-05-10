/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';

import Artwork from 'types/Artwork';
import { transactionButton } from '../styles';

import TransactionContent from '../TransactionContent';

interface BurnViewProps {
  onSubmit: () => void;
  artwork: Artwork;
}

export default function BurnView(props: BurnViewProps): JSX.Element {
  const { onSubmit, artwork } = props;

  return (
    <TransactionContent
      title="Burn this NFT"
      description="Burning an NFT destroys the NFT and removes it from your creator profile. Please note, this action cannot be reversed."
    >
      <Box sx={transactionButton}>
        <Button sx={{ width: '100%' }} onClick={onSubmit}>
          Burn NFT
        </Button>
      </Box>
    </TransactionContent>
  );
}

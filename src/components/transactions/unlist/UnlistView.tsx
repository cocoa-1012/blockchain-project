/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';
import { transactionButton } from '../styles';

import TransactionContent from '../TransactionContent';

interface UnlistViewProps {
  onSubmit: () => void;
}

export default function UnlistView(props: UnlistViewProps): JSX.Element {
  const { onSubmit } = props;

  return (
    <TransactionContent
      title="Unlist this NFT"
      description={`Unlisting an NFT will remove the NFT from escrow and return it to your wallet. Please note—even when unlisted, this artwork will still remain on your profile. If you'd like to remove it, you will need to burn it.`}
    >
      <Box>
        <Button sx={transactionButton} onClick={onSubmit}>
          Continue
        </Button>
      </Box>
    </TransactionContent>
  );
}

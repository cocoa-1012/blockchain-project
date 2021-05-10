/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Button } from 'theme-ui';
import { ReactNode } from 'react';

import ModalCopy from 'components/modals/common/ModalCopy';
import ModalHeading from 'components/modals/common/ModalHeading';

interface WalletErrorStateProps {
  children: ReactNode;
  resetModal: () => void;
  title: string;
}

export default function WalletErrorState(
  props: WalletErrorStateProps
): JSX.Element {
  const { children, title, resetModal } = props;
  return (
    <>
      <ModalHeading sx={{ maxWidth: 'none', marginBottom: 's' }}>
        {title}
      </ModalHeading>
      <Grid gap="xl">
        <ModalCopy sx={{ fontSize: 'sub', maxWidth: 220 }}>
          {children}
        </ModalCopy>
        <Button onClick={resetModal}>Retry</Button>
      </Grid>
    </>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Button } from 'theme-ui';

import ModalCopy from 'components/modals/common/ModalCopy';
import ModalHeading from 'components/modals/common/ModalHeading';

export default function MetaMaskNotInstalled(): JSX.Element {
  return (
    <>
      <ModalHeading sx={{ maxWidth: 'none', marginBottom: 's' }}>
        Install MetaMask.
      </ModalHeading>
      <Grid gap="xl">
        <ModalCopy sx={{ fontSize: 'sub', maxWidth: 220 }}>
          Install MetaMask to connect to Foundation.
        </ModalCopy>
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
          sx={{ display: 'block' }}
        >
          <Button sx={{ width: '100%' }}>Go to MetaMask's website</Button>
        </a>
      </Grid>
    </>
  );
}

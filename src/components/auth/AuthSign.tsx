/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text, Flex } from 'theme-ui';

import ModalHeading from 'components/modals/common/ModalHeading';
import SpinnerStroked from 'components/SpinnerStroked';

export default function AuthSign(): JSX.Element {
  return (
    <>
      <ModalHeading sx={{ maxWidth: 'none', marginBottom: 's' }}>
        Please sign the message in your wallet to continue.
      </ModalHeading>
      <Grid gap="l" sx={{ paddingX: 's' }}>
        <Text variant="body.body" sx={{ textAlign: 'center', fontSize: 'sub' }}>
          Foundation uses this signature to verify that you’re the owner of this
          Ethereum address.
        </Text>
        <Flex sx={{ justifyContent: 'center' }}>
          <SpinnerStroked size={55} />
        </Flex>
      </Grid>
    </>
  );
}

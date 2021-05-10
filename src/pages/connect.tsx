/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Heading } from 'theme-ui';

import Page from 'components/Page';
import AuthContainer from 'components/auth/AuthContainer';
import ConnectWallet from 'components/auth/ConnectWallet';

import useAuthToken from 'hooks/queries/use-auth-token';
import useRedirectToProfile from 'hooks/use-redirect-to-profile';

import { PageTypes } from 'types/page';

export default function Connect(): JSX.Element {
  const { user } = useAuthToken();
  useRedirectToProfile(user);

  return (
    <Page absolute title="Connect to Foundation" type={PageTypes.minimal}>
      <Flex sx={{ flex: 1 }}>
        <AuthContainer>
          <Box>
            <Heading
              variant="h.l"
              sx={{ marginBottom: 's', textAlign: 'center' }}
            >
              Connect your wallet.
            </Heading>
            <ConnectWallet />
          </Box>
        </AuthContainer>
      </Flex>
    </Page>
  );
}

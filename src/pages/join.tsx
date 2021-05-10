/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { Box, Button, Flex, Grid, Heading, jsx, Text } from 'theme-ui';
import { useRouter } from 'next/router';
import { isNil } from 'ramda';
import { useCallback, useState } from 'react';

import Page from 'components/Page';
import LoadingButton from 'components/buttons/LoadingButton';
import Link from 'components/links/Link';
import LoadingPage from 'components/LoadingPage';
import WalletLink from 'components/auth/WalletLink';
import ConnectWalletButton from 'components/headers/ConnectWalletButton';

import useAuthToken from 'hooks/queries/use-auth-token';
import useInviteCode from 'hooks/queries/server/use-invite-code';
import useRedeemInvite from 'hooks/mutations/server/use-redeem-invite';
import useModal from 'hooks/use-modal';

import { PageTypes } from 'types/page';
import { StyleObject } from 'types/styles';

import { getFirstValue } from 'utils/helpers';
import { ModalKey } from 'types/modal';

export default function MetaMaskLoginWithCode(): JSX.Element {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useAuthToken();

  const { setCurrentModal } = useModal();

  const openAuthModal = () => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inviteCode: string = getFirstValue(router.query.code);

  const sx = getStyles();

  const { data: inviteCodeData, error } = useInviteCode({
    inviteCode,
    token: user?.token,
  });

  // Note: If the user isn't logged in, we don't want to use this hook
  // but instead we do the mutation directly when they do successfully connect
  // their wallet.

  // so that we don't have to pass through the invite inviteCode
  // to an authed screen that will use it
  // in the
  const [redeemInvite] = useRedeemInvite(inviteCode, user?.token);

  const redeemInviteAsync = useCallback(async () => {
    setIsLoading(true);
    try {
      await redeemInvite();
      router.push('/profile');
    } catch (err) {
      setIsLoading(false);
      // console.log(err);
    }
  }, [redeemInvite, router]);

  const inviteCodeObject = inviteCodeData?.inviteCode;
  const redeemedAt: string = inviteCodeObject?.redeemedAt;

  const isError = !isNil(redeemedAt) || error;
  const codeIsUsable = Boolean(inviteCode && isNil(redeemedAt) && user);

  if (isUserLoading || isLoading) {
    return (
      <Page title="Accept Invite" type={PageTypes.minimal}>
        <LoadingPage />
      </Page>
    );
  }

  if (!user) {
    return (
      <Page title="Accept Invite" type={PageTypes.minimal}>
        <Flex sx={sx.container}>
          <Grid sx={sx.grid}>
            <Grid gap="xl">
              <Heading variant="h.l">
                Connect your wallet to accept invite
              </Heading>
              <Flex sx={{ justifyContent: 'center' }}>
                <ConnectWalletButton isDark={false} />
              </Flex>
            </Grid>
          </Grid>
        </Flex>
      </Page>
    );
  }

  // If user is logged in and the invite code is valid
  // use hook that returns mutation function
  // and call that in a useEffect

  if (isError) {
    return (
      <Page title="Accept Invite" type={PageTypes.minimal}>
        <Flex sx={sx.container}>
          <Grid sx={sx.grid}>
            <Grid gap="xl">
              <Heading variant="h.l">
                This invite code has already been used.
              </Heading>
              <Link href="/">
                <a
                  sx={{
                    display: 'block',
                    maxWidth: 300,
                    width: '100%',
                    marginX: 'auto',
                  }}
                >
                  <Button sx={{ width: '100%' }}>Back home</Button>
                </a>
              </Link>
            </Grid>
          </Grid>
        </Flex>
      </Page>
    );
  }

  if (codeIsUsable) {
    return (
      <Page title="Accept Invite" type={PageTypes.minimal}>
        <Flex sx={sx.container}>
          <Grid sx={sx.grid}>
            <Grid gap="l">
              <Grid gap="m">
                <Heading variant="h.l">Become a creator on Foundation</Heading>
                <Text variant="body.body" sx={sx.text}>
                  You’ve been invited to join Foundation as a creator. We can’t
                  wait to see what you create.
                </Text>
              </Grid>
              <Box sx={{ maxWidth: 300, width: '100%', marginX: 'auto' }}>
                <LoadingButton
                  onClick={redeemInviteAsync}
                  sx={{ width: '100%' }}
                  isLoading={isLoading}
                >
                  Accept Invite
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Flex>
      </Page>
    );
  }

  return (
    <Page title="Accept Invite" type={PageTypes.minimal}>
      <Flex sx={sx.container}>
        <Grid gap="xl">
          <Grid sx={sx.grid}>
            <Heading variant="h.l">Become a creator on Foundation</Heading>
            <Text variant="body.body" sx={sx.text}>
              You’ve been invited to join Foundation as a creator. We can’t wait
              to see what you create.
            </Text>
          </Grid>

          <Grid gap="s" sx={{ maxWidth: 300, marginX: 'auto' }}>
            <Text variant="h.xs" sx={{ textAlign: 'center' }}>
              Connect your wallet to join
            </Text>
            <WalletLink onClick={openAuthModal} />
          </Grid>
        </Grid>
      </Flex>
    </Page>
  );
}

const getStyles = (): StyleObject => ({
  container: {
    paddingTop: 'xl',
    paddingBottom: 'xxxxl',
    margin: 'auto',
  },
  grid: {
    maxWidth: 440,
    marginX: 'auto',
    textAlign: 'center',
    gap: 'm',
  },
  text: {
    textAlign: 'center',
    maxWidth: 380,
    marginX: 'auto',
  },
});

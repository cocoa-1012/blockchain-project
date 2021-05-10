import { css, Global } from '@emotion/react';
import { styled } from 'stitches.config';
import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { useWeb3React } from '@web3-react/core';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import WalletAddressField from 'components/forms/WalletAddressField';
import LoadingPage from 'components/LoadingPage';

import { MigrateAccountSchema } from 'schemas/migrateAccount';
import { sendMigrateAccount } from 'queries/admin/admin';

import { useExternalWalletLogout } from 'utils/auth';

import useModal from 'hooks/use-modal';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { ModalKey } from 'types/modal';

const Wrapper = styled(Box, {
  boxShadow: '$1',
  paddingLeft: '$8',
  paddingRight: '$8',
  paddingTop: '$6',
  paddingBottom: '$6',
  marginRight: 'auto',
  marginLeft: 'auto',
  backgroundColor: '$white100',
  borderRadius: '$2',
  maxWidth: 480,
});

const Heading = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$4',
  letterSpacing: -0.8,
  marginBottom: '$6',
});

const Copy = styled(Text, {
  fontFamily: '$body',
  fontSize: '$1',
  lineHeight: 1.6,
  marginBottom: '$4',
});

const SubHeading = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$2',
  marginBottom: '$1',
  marginTop: '$8',
});

const Submit = styled(Button, {
  width: '100%',
  variants: {
    disabled: {
      true: {
        backgroundColor: '$black20',
        cursor: 'auto',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default function MigrateAccount(): JSX.Element {
  const { user } = useAuthToken();
  const router = useRouter();
  const { setCurrentModal } = useModal();
  const {
    library: provider,
    account: publicKey,
    active: isProviderActive,
  } = useWeb3React();
  const handleLogout = useExternalWalletLogout();
  const [isPendingSign, setIsPendingSign] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { mutate } = useMutation(sendMigrateAccount, {
    onSuccess: () => {
      setHasSubmitted(true);
      setIsPendingSign(false);
    },
  });

  const publicAddress = user?.publicAddress;

  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useUserByPublicKey({
      publicKey: publicAddress,
      refetchOnWindowFocus: false,
    });

  const handleSubmit = async (values) => {
    const { to, from } = values;

    if (!isProviderActive) {
      return setCurrentModal(ModalKey.AUTH_MAIN);
    }
    setIsPendingSign(true);
    const msg = `I authorize Foundation to migrate my account to ${to.toLowerCase()}`;
    try {
      const hexlifiedMessage = hexlify(toUtf8Bytes(msg));
      const signature = await provider.send('personal_sign', [
        hexlifiedMessage,
        publicKey.toLowerCase(),
      ]);

      mutate({ signature, to, from });
    } catch (e) {
      setIsPendingSign(false);
    }
  };

  const handleDisconnect = async () => {
    await router.push('/');
    await handleLogout();
  };

  const userApprovedForMigration = currentUser?.user?.isApprovedForMigrationAt;

  useEffect(() => {
    if (publicAddress && !isCurrentUserLoading && !userApprovedForMigration) {
      router.replace('/');
    }
  }, [userApprovedForMigration, isCurrentUserLoading, publicAddress, router]);

  if (!user || !userApprovedForMigration) {
    return <LoadingPage />;
  }

  return (
    <Page title="Migrate Account">
      <Global
        styles={css`
          body {
            background-color: #e5e5e5;
          }
        `}
      />
      <Body css={{ paddingX: 0 }}>
        {hasSubmitted ? (
          <Box
            css={{
              maxWidth: 420,
              textAlign: 'center',
              marginRight: 'auto',
              marginLeft: 'auto',
              marginTop: '$8',
            }}
          >
            <Heading>Your account migration was confirmed.</Heading>
            <Copy css={{ marginBottom: '$8' }}>
              The process of migrating your account has started. Please be
              patient — this takes as little as 24 hours to complete, but could
              take up to a week.
            </Copy>
            <Submit
              color="black"
              size="large"
              shape="regular"
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </Submit>
          </Box>
        ) : (
          <Wrapper>
            <Heading>Account Migration</Heading>
            <Copy>
              All NFTs you’ve created and collected and any splits you’ve been a
              part of will be migrated to your new wallet, and these events will
              reflect in your NFT’s activity section.
            </Copy>
            <Copy>
              Your followers and following data will be transferred, but
              information such as your username, bio, and profile image will
              need to be re-added to your new account.
            </Copy>
            <SubHeading>New ETH Address</SubHeading>
            <Copy css={{ marginBottom: '$6' }}>
              Enter the address of your new Ethereum wallet.
            </Copy>
            <Formik
              initialValues={{ to: '', from: publicAddress }}
              onSubmit={handleSubmit}
              validationSchema={MigrateAccountSchema}
            >
              <Form>
                <Box css={{ marginBottom: '$4' }}>
                  <WalletAddressField name="to" placeholder="0x..." />
                </Box>
                <Submit
                  color="black"
                  size="large"
                  shape="regular"
                  type="submit"
                  disabled={isPendingSign}
                >
                  {isPendingSign ? 'Confirming…' : 'Continue'}
                </Submit>
              </Form>
            </Formik>
          </Wrapper>
        )}
      </Body>
    </Page>
  );
}

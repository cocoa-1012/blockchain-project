/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex, Heading, Text } from 'theme-ui';
import { length, propEq, filter, compose } from 'ramda';

import Body from 'components/Body';
import Page, { PageProps } from 'components/Page';
import SpinnerStroked from 'components/SpinnerStroked';
import InviteCodeRow from 'components/invites/InviteCodeRow';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import LoadingPage from 'components/LoadingPage';
import TrustSafetyInvitesGuard from 'components/trust-safety/page-guards/TrustSafetyInvitesGuard';

import useInviteCodes from 'hooks/queries/server/use-invite-codes';
import useAuthToken from 'hooks/queries/use-auth-token';

import InviteCode from 'types/InviteCode';
import { StyleObject } from 'types/styles';

export default function Invite(): JSX.Element {
  const { user, isLoading } = useAuthToken();

  const { data, loading } = useInviteCodes({ token: user?.token });

  const sx = getStyles();

  const pageProps: PageProps = {
    title: 'Invite a Creator',
    footerStyle: { display: 'none' },
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock pageProps={{ ...pageProps, absolute: true }} />;
  }

  return (
    <TrustSafetyInvitesGuard>
      <Page {...pageProps}>
        <Body sx={sx.container}>
          <Grid gap="s" sx={{ marginBottom: 'l' }}>
            <Heading variant="h.l" sx={sx.heading}>
              Invite a Creator
            </Heading>
            <Text variant="body.body" sx={sx.text}>
              Copy an invite URL and share it with a creator to give them access
              to Foundation’s creator tools.
            </Text>
          </Grid>
          <Grid gap="xl">
            <RenderInviteCodes
              isLoading={loading}
              inviteCodes={data?.myInviteCodes}
            />
          </Grid>
        </Body>
      </Page>
    </TrustSafetyInvitesGuard>
  );
}

interface RenderInviteCodesProps {
  isLoading: boolean;
  inviteCodes: InviteCode[];
}

const getInviteCount = compose<InviteCode[], InviteCode[], number>(
  length,
  filter(propEq('redeemedAt', null))
);

function RenderInviteCodes(props: RenderInviteCodesProps): JSX.Element {
  const { isLoading, inviteCodes = [] } = props;

  const sortedInviteCodes = [...inviteCodes].sort((a, b) => {
    return Boolean(a.redeemedAt) === Boolean(b.redeemedAt)
      ? 0
      : a.redeemedAt
      ? 1
      : -1;
  });

  if (isLoading) {
    return (
      <Flex sx={{ justifyContent: 'center' }}>
        <SpinnerStroked size={48} />
      </Flex>
    );
  }

  const inviteCount = getInviteCount(inviteCodes);
  const totalInviteCount = length(inviteCodes);

  return (
    <Grid gap="xl">
      <Text variant="h.xs" sx={{ textAlign: 'center' }}>
        {inviteCount}/{totalInviteCount} Invites Available
      </Text>
      <Grid gap={10}>
        {sortedInviteCodes.map((inviteCode, index) => (
          <InviteCodeRow
            inviteCode={inviteCode}
            sx={{ zIndex: index }}
            key={index}
          />
        ))}
      </Grid>
    </Grid>
  );
}

const getStyles = (): StyleObject => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 640,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 'xxl',
    paddingTop: ['m', 'xl'],
  },
  heading: {
    textAlign: 'center',
  },
  text: {
    maxWidth: 300,
    marginX: 'auto',
    textAlign: 'center',
  },
});

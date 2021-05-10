/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
/* eslint-disable react/jsx-max-depth */
import { jsx, Flex, Grid, Button } from 'theme-ui';
import { useRouter } from 'next/router';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import InternalLink from 'components/links/InternalLink';
import Link from 'components/links/Link';
import EmailCaptureForm from 'components/forms/transactions/EmailCaptureForm';

import { getFirstValue, isValidTxHash } from 'utils/helpers';

import Account from 'types/Account';
import {
  mobileAlignCenter,
  transactionButton,
} from 'components/transactions/styles';

interface BidSubmittedActionsProps {
  user: Account;
  token: string;
  publicAddress: string;
  className?: string;
}

export default function BidSubmittedActions(
  props: BidSubmittedActionsProps
): JSX.Element {
  const { user, token, publicAddress, className } = props;

  const router = useRouter();

  const userEmail = user?.email;

  const { username, slug } = router.query;

  const txHash = getFirstValue(router.query.txHash);

  const profilePath = `/${username}/${slug}`;

  // TODO: remove this when the design of the email capture form is figured out
  const enabled = true;

  if (enabled || userEmail) {
    return (
      <Grid gap="l" sx={transactionButton} className={className}>
        <Link href={profilePath}>
          <a sx={{ display: 'block', textDecoration: 'none' }}>
            <Button sx={{ width: '100%' }} variant="outline">
              View artwork
            </Button>
          </a>
        </Link>

        {isValidTxHash(txHash) && (
          <Flex sx={mobileAlignCenter}>
            <TransactionHashLink txHash={txHash} />
          </Flex>
        )}
      </Grid>
    );
  }

  return (
    <Grid sx={{ maxWidth: 320, width: '100%' }} className={className}>
      <Grid gap="l" sx={{ marginBottom: 'xl' }}>
        {isValidTxHash(txHash) && <TransactionHashLink txHash={txHash} />}
      </Grid>

      <Grid sx={{ marginBottom: 's' }}>
        <EmailCaptureForm
          user={user}
          token={token}
          publicAddress={publicAddress}
        />
      </Grid>

      <Flex>
        <InternalLink href={profilePath}>Skip</InternalLink>
      </Flex>
    </Grid>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import Link from 'components/links/Link';
import { jsx, Box, Button } from 'theme-ui';

import Account from 'types/Account';

import { buildUserProfilePath } from 'utils/artwork/artwork';

import TransactionContent from '../TransactionContent';

interface SecondaryListMissingVerificationProps {
  currentUser: Account;
}

export default function SecondaryListMissingVerification(
  props: SecondaryListMissingVerificationProps
): JSX.Element {
  const { currentUser } = props;

  return (
    <TransactionContent
      title="The creator of this NFT is missing social verification"
      description={
        <Box sx={{ maxWidth: 340 }}>
          In order to list this NFT in the secondary market, the original
          creator will need to verify their profile via social media.
        </Box>
      }
    >
      <Link href={buildUserProfilePath({ user: currentUser })}>
        <a sx={{ display: 'block', textDecoration: 'none' }}>
          <Button sx={{ width: 230 }} type="button">
            Back
          </Button>
        </a>
      </Link>
    </TransactionContent>
  );
}

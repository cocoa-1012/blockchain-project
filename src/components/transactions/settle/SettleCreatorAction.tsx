/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Box } from '@theme-ui/components';

import TransactionSuccessLink from '../TransactionSuccessLink';
import { transactionButton } from '../styles';

import { buildUserProfilePath } from 'utils/artwork/artwork';

import Account from 'types/Account';

interface SettleCreatorActionProps {
  user: Account;
}

export default function SettleCreatorAction(
  props: SettleCreatorActionProps
): JSX.Element {
  const { user } = props;
  return (
    <Box sx={transactionButton}>
      <TransactionSuccessLink
        href={buildUserProfilePath({ user })}
        variant="primary"
      >
        View profile
      </TransactionSuccessLink>
    </Box>
  );
}

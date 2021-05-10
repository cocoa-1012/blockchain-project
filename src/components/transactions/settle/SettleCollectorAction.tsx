/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Grid } from '@theme-ui/components';

import TwitterShareButtonLink from 'components/links/TwitterShareButtonLink';
import TransactionSuccessLink from '../TransactionSuccessLink';

import { buildUserProfilePath } from 'utils/artwork/artwork';

import Account from 'types/Account';

interface SettleCollectorActionProps {
  user: Account;
  twitterShareText: string;
}

export default function SettleCollectorAction(
  props: SettleCollectorActionProps
): JSX.Element {
  const { user, twitterShareText } = props;
  return (
    <Grid columns={[1, 2]} gap={10}>
      <TwitterShareButtonLink twitterShareText={twitterShareText} />

      <TransactionSuccessLink
        href={buildUserProfilePath({
          user,
        })}
        variant="outline"
        sx={{ backgroundColor: 'transparent' }}
      >
        View profile
      </TransactionSuccessLink>
    </Grid>
  );
}

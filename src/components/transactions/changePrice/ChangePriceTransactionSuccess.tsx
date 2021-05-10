/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex } from 'theme-ui';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';

import { ChangePriceTransactionProps } from 'components/transactions/changePrice/types';
import TransactionContent from '../TransactionContent';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import { buildUserProfilePath } from 'utils/artwork/artwork';
import { mobileAlignCenter } from 'components/transactions/styles';

interface ChangePriceTransactionSuccessProps
  extends ChangePriceTransactionProps {
  artworkPath: string;
  profilePath: string;
  status: string;
  isEventEmitted: boolean;
}

export default function ChangePriceTransactionSuccess(
  props: ChangePriceTransactionSuccessProps
): JSX.Element {
  const {
    artwork,
    txHash,
    status,
    artworkPath,
    profilePath,
    isEventEmitted,
  } = props;

  const isPriceChanged = isEventEmitted;

  return (
    <TransactionContent
      title="Reserve price changed."
      description="The reserve price has been changed for your NFT."
    >
      <Grid columns={[1, 2]} gap={10}>
        <TransactionSuccessLink
          href={artworkPath}
          isLoading={!isPriceChanged}
          variant="primary"
        >
          View artwork
        </TransactionSuccessLink>
        <TransactionSuccessLink
          href={profilePath}
          isLoading={!isPriceChanged}
          variant="outline"
          sx={{ backgroundColor: 'transparent' }}
        >
          View profile
        </TransactionSuccessLink>
      </Grid>

      <Flex sx={mobileAlignCenter}>
        <TransactionHashLink txHash={txHash} />
      </Flex>
    </TransactionContent>
  );
}

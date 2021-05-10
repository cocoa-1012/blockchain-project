/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box, Text, ThemeUIStyleObject } from 'theme-ui';

import { HistoryEventProps } from './types';

import HistoryEventDate from './HistoryEventDate';
import HistoryEventAvatar from './HistoryEventAvatar';
import ETHinUSD from 'components/ETHinUSD';
import InternalInlineLink from 'components/links/InternalInlineLink';
import FollowPopover from 'components/follows/FollowPopover';

import { formatETHWithSuffix } from 'utils/formatters';
import {
  getBuyerUsernameOrAddressInfo,
  getUsernameOrAddress,
} from 'utils/helpers';
import Account from 'types/Account';
import NftHistory from 'types/NftHistory';

export default function HistoryEventSold(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent, user } = props;

  const sx = getStyles();

  return (
    <Grid sx={{ position: 'relative', justifyContent: 'center' }}>
      <Grid sx={sx.container}>
        <HistoryEventAvatar user={user} sx={sx.avatar} />
        <Grid gap={5}>
          <HistoryEventWonBy user={user} />
          <HistoryEventSoldFor historyEvent={historyEvent} />
          <HistoryEventDate date={historyEvent.date} />
        </Grid>
      </Grid>
      <Box sx={sx.line} />
    </Grid>
  );
}

interface HistoryEventSoldForProps {
  historyEvent: NftHistory;
}

function HistoryEventSoldFor(props: HistoryEventSoldForProps): JSX.Element {
  const { historyEvent } = props;

  const sx = getStyles();

  return (
    <Text variant="h.xs" sx={sx.soldFor}>
      Sold for {formatETHWithSuffix(historyEvent.amountInETH)}{' '}
      <span sx={{ color: 'black.60' }}>
        <ETHinUSD amount={historyEvent.amountInETH} />
      </span>
    </Text>
  );
}

interface HistoryEventWonByProps {
  user: Account;
}

function HistoryEventWonBy(props: HistoryEventWonByProps): JSX.Element {
  const { user } = props;

  const { usernameOrAddress, isAddress } = getBuyerUsernameOrAddressInfo(user);

  const sx = getStyles();

  return (
    <Text variant="h.xs" sx={sx.wonBy}>
      Auction won by{' '}
      <FollowPopover
        publicKey={user.publicKey}
        sx={{ display: 'inline-block', zIndex: 10 }}
      >
        <InternalInlineLink
          variant={isAddress ? 'mono.body' : 'h.xs'}
          sx={sx.wonBy}
          href={`/${getUsernameOrAddress(user)}`}
        >
          {usernameOrAddress}
        </InternalInlineLink>
      </FollowPopover>
    </Text>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    justifyContent: 'center',
    textAlign: 'center',
    paddingY: ['s', 'm'],
    paddingX: 10,
    gap: 0,
    position: 'relative',
    zIndex: 10,
  };
  const line: ThemeUIStyleObject = {
    position: 'absolute',
    bottom: [42, 57],
    left: 0,
    width: '100%',
    height: 1,
    backgroundColor: 'black.10',
    zIndex: 1,
  };

  const avatar: ThemeUIStyleObject = {
    marginX: 'auto',
    marginBottom: 10,
  };

  const soldFor: ThemeUIStyleObject = {
    paddingX: 'm',
    backgroundColor: 'white.100',
    marginX: 'auto',
    fontSize: ['body', 'xs'],
  };
  const wonBy: ThemeUIStyleObject = {
    fontSize: ['body', 'xs'],
  };
  return { container, line, avatar, soldFor, wonBy };
};

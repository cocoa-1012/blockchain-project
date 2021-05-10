/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { head, last } from 'ramda';

import { HistoryEventProps } from './types';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

import { getEventStyles } from './styles';

import HistoryEventRow from 'components/artworks/history/HistoryEventRow';
import HistoryEventDetails from 'components/artworks/history/HistoryEventDetails';
import HistoryEventUserLink from 'components/artworks/history/HistoryEventUserLink';
import EtherscanIconLink from 'components/links/EtherscanIconLink';
import HistoryEventAvatar from './HistoryEventAvatar';

interface HistoryEventOwnerMigratedProps extends HistoryEventProps {
  label: string;
}

export default function HistoryEventOwnerMigrated(
  props: HistoryEventOwnerMigratedProps
): JSX.Element {
  const { historyEvent, users } = props;

  const migratedTo = last(users);

  const sx = getEventStyles();

  return (
    <HistoryEventRow>
      <HistoryEventAvatar user={migratedTo} />

      <Flex sx={sx.info}>
        <Flex sx={sx.details}>
          <HistoryEventDetails date={historyEvent.date} sx={sx.text}>
            Owner account migrated to{' '}
            <HistoryEventUserLink sx={sx.text} user={migratedTo} />
          </HistoryEventDetails>
        </Flex>
      </Flex>

      <EtherscanIconLink
        href={buildEtherscanLink(`/tx/${historyEvent.transactionHash}`)}
        sx={sx.link}
      />
    </HistoryEventRow>
  );
}

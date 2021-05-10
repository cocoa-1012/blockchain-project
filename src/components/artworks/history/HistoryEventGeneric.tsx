/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';

import { HistoryEventProps } from './types';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

import HistoryEventAmount from 'components/artworks/history/HistoryEventAmount';
import HistoryEventRow from 'components/artworks/history/HistoryEventRow';
import HistoryEventAvatar from 'components/artworks/history/HistoryEventAvatar';
import HistoryEventDetails from 'components/artworks/history/HistoryEventDetails';
import HistoryEventUserLink from 'components/artworks/history/HistoryEventUserLink';
import EtherscanIconLink from 'components/links/EtherscanIconLink';
import { getEventStyles } from './styles';

interface HistoryEventGenericProps extends Omit<HistoryEventProps, 'users'> {
  label: string;
}

export default function HistoryEventGeneric(
  props: HistoryEventGenericProps
): JSX.Element {
  const { historyEvent, user, label } = props;

  const sx = getEventStyles();

  return (
    <HistoryEventRow>
      <HistoryEventAvatar user={user} />

      <Flex sx={sx.info}>
        <Flex sx={sx.details}>
          <HistoryEventDetails date={historyEvent.date} sx={sx.text}>
            {label} <HistoryEventUserLink sx={sx.text} user={user} />
          </HistoryEventDetails>
        </Flex>

        {historyEvent.amountInETH && (
          <Flex sx={sx.amount}>
            <HistoryEventAmount amountInETH={historyEvent.amountInETH} />
          </Flex>
        )}
      </Flex>

      <EtherscanIconLink
        href={buildEtherscanLink(`/tx/${historyEvent.transactionHash}`)}
        sx={sx.link}
      />
    </HistoryEventRow>
  );
}

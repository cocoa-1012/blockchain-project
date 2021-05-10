/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { head, last } from 'ramda';

import { HistoryEventProps } from './types';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

import { getEventStyles } from './styles';

import HistoryEventAmount from 'components/artworks/history/HistoryEventAmount';
import HistoryEventRow from 'components/artworks/history/HistoryEventRow';
import HistoryEventDetails from 'components/artworks/history/HistoryEventDetails';
import HistoryEventUserLink from 'components/artworks/history/HistoryEventUserLink';
import EtherscanIconLink from 'components/links/EtherscanIconLink';
import HistoryEventAvatars from './HistoryEventAvatars';

interface HistoryEventTransferredProps extends HistoryEventProps {
  label: string;
}

export default function HistoryEventTransferred(
  props: HistoryEventTransferredProps
): JSX.Element {
  const { historyEvent, users } = props;

  const transferredFrom = head(users);
  const transferredTo = last(users);

  const sx = getEventStyles();

  return (
    <HistoryEventRow>
      <HistoryEventAvatars users={users} />

      <Flex sx={sx.info}>
        <Flex sx={sx.details}>
          <HistoryEventDetails date={historyEvent.date} sx={sx.text}>
            Transferred from{' '}
            <HistoryEventUserLink sx={sx.text} user={transferredFrom} /> to{' '}
            <HistoryEventUserLink sx={sx.text} user={transferredTo} />
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

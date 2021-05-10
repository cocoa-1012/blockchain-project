/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box, Flex, Grid } from 'theme-ui';
import { length } from 'ramda';

import { formatETHWithSuffix } from 'utils/formatters';
import { isEmptyOrNil } from 'utils/helpers';
import useCountdown from 'hooks/use-countdown';

import Account from 'types/Account';

interface InAuctionStateProps {
  currentBidPrice: number;
  dateEnding: string;
  bidders: Account[];
}

export default function InAuctionState(
  props: InAuctionStateProps
): JSX.Element {
  const { currentBidPrice, dateEnding, bidders } = props;

  const numberOfBids = bidders.length;

  return (
    <Flex
      sx={{
        backgroundColor: 'black.100',
        paddingX: 'm',
        paddingY: 'm',
      }}
    >
      <Box>
        <Text
          variant="stnd.xs"
          sx={{ fontWeight: 600, color: 'black.50', marginBottom: 'xxs' }}
        >
          Current bid
        </Text>
        <Flex>
          <Text
            variant="stnd.xs"
            sx={{ fontWeight: 600, color: 'white.100', marginRight: 'xs' }}
          >
            {formatETHWithSuffix(currentBidPrice)}
          </Text>
          <ArtworkCardCountdown timestamp={dateEnding} />
        </Flex>
      </Box>

      <Box sx={{ marginLeft: 'auto', alignSelf: 'center' }}>
        <Text variant="stnd.xs" sx={{ fontWeight: 600, color: 'black.50' }}>
          {numberOfBids} bid{numberOfBids === 1 ? '' : 's'}
        </Text>
      </Box>
    </Flex>
  );
}

interface ArtworkCardCountdownProps {
  timestamp: string;
}

function ArtworkCardCountdown(props: ArtworkCardCountdownProps): JSX.Element {
  const { timestamp } = props;

  const { countdownParts, hasEnded } = useCountdown(timestamp);

  if (hasEnded) {
    return null;
  }

  return (
    <Grid gap="xxs" columns={`repeat(${length(countdownParts)}, 1fr)`}>
      {countdownParts.map((part, key) => (
        <Box key={key}>
          <Text variant="stnd.body" sx={{ color: 'black.50', fontWeight: 600 }}>
            {part.formattedValue}
            {part.shortLabel}
          </Text>
        </Box>
      ))}
    </Grid>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';

import { formatBidDateShort } from 'utils/dates/dates';

interface HistoryEventDateProps {
  date: string;
}

export default function HistoryEventDate(
  props: HistoryEventDateProps
): JSX.Element {
  const { date } = props;
  return (
    <Text
      variant="stnd.body"
      sx={{ color: 'black.50', fontSize: [12, 'body'] }}
    >
      {formatBidDateShort(date)}
    </Text>
  );
}

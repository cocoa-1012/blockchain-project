/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Flex } from 'theme-ui';
import { formatDateJoined } from 'utils/dates/dates';

interface ProfileJoinedDateProps {
  dateJoined: string;
}

export default function ProfileJoinedDate(
  props: ProfileJoinedDateProps
): JSX.Element {
  const { dateJoined } = props;

  if (!dateJoined) {
    return null;
  }

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        borderTop: 'solid 1px',
        borderBottom: 'solid 1px',
        borderColor: 'black.10',
        paddingY: 's',
        alignItems: 'center',
      }}
    >
      <Text variant="h.xs" sx={{ lineHeight: 1 }}>
        Joined
      </Text>
      <Text variant="stnd.body" sx={{ lineHeight: 1 }}>
        {formatDateJoined(dateJoined)}
      </Text>
    </Flex>
  );
}

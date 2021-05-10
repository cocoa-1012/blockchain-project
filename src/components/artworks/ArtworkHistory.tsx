/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Heading } from 'theme-ui';

import NftHistory from 'types/NftHistory';
import HistoryEvent from './history/HistoryEvent';
import Account from 'types/Account';

import useUsersByPublicKeys from 'hooks/queries/hasura/use-users-by-public-keys';

import { findArtworkHistoryUsers, getHistoryPublicKeys } from 'utils/history';
import { getFirstValue } from 'utils/helpers';
import { getUsers } from 'utils/users';

import { ALL_USER_MODERATION_STATUSES } from 'lib/constants';

import GraySquare from 'components/GraySquare';

interface ArtworkHistoryProps {
  history: NftHistory[];
}

export default function ArtworkHistory(
  props: ArtworkHistoryProps
): JSX.Element {
  const { history } = props;

  const { data: usersData, isLoading } = useUsersByPublicKeys({
    publicKeys: getHistoryPublicKeys(history),
    moderationStatuses: ALL_USER_MODERATION_STATUSES,
  });

  const users = getUsers<unknown, Account[]>(usersData);

  if (isLoading) {
    return (
      <Grid gap="m">
        <Heading variant="h.s">Activity</Heading>
        <ArtworkHistorySkeleton />
      </Grid>
    );
  }

  return (
    <Grid gap="m">
      <Heading variant="h.s">Activity</Heading>
      <Grid sx={{ gap: 10 }}>
        {history.map((historyItem, index) => {
          const matchedUsers = findArtworkHistoryUsers(historyItem, users);
          return (
            <HistoryEvent
              key={index}
              historyEvent={historyItem}
              // return the first user for convenience
              user={getFirstValue(matchedUsers)}
              users={matchedUsers}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

export function ArtworkHistorySkeleton(): JSX.Element {
  return (
    <Grid sx={{ gap: 10 }}>
      {[...Array(4)].map((_, index) => (
        <GraySquare
          sx={{ borderRadius: 10, backgroundColor: 'black.5' }}
          width="100%"
          height={84}
          key={index}
        />
      ))}
    </Grid>
  );
}

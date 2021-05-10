import React from 'react';
import { groupBy } from 'ramda';
import { styled, css } from 'stitches.config';
import format from 'date-fns/format';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Page from 'components/Page';
import Body from 'components/base/Body';

import useAuthToken from 'hooks/queries/use-auth-token';
import NotificationFollow from 'components/notifications/NotificationFollow';
import useNotificationsFollows from 'hooks/queries/hasura/use-notifications-followers';

import { NotificationFollowUser } from 'types/Notification';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import NotificationFollowSkeleton from 'components/notifications/NotificationFollowSkeleton';
import GraySquare from 'components/GraySquare';

const Container = styled(Box, {
  maxWidth: 680,
  marginX: 'auto',
  paddingY: '$9',
});

const PageHeader = styled(Text, {
  fontFamily: '$body',
  fontSize: '$5',
  fontWeight: 600,
  letterSpacing: -1,
  textAlign: 'center',
  marginBottom: '$7',
});

const MonthHeader = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$2',
  textAlign: 'center',
  marginBottom: '$7',
});

const MonthWrapper = styled(Box, {
  marginBottom: '$9',
});

const notificationFollowStyles = css({
  marginBottom: '$4',
  transition: 'transform $1 $ease',
  '&:before': {
    content: '',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
    boxShadow: '$0',
    borderRadius: '$2',
    transition: 'box-shadow $1 $ease',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    '&:before': { boxShadow: '$1' },
  },
});

function SkeletonArray() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <NotificationFollowSkeleton
          key={i}
          css={{
            marginBottom: '$4',
          }}
        />
      ))}
    </>
  );
}

export default function NotificationsPage(): JSX.Element {
  const { user } = useAuthToken();

  const currentUserPublicKey = user?.publicAddress;
  const token = user?.token;

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
  } = useNotificationsFollows({
    publicKey: currentUserPublicKey,
    perPage: 20,
  });

  const followingUsers = data?.pages?.flatMap((d) => d.follow);
  const groupedFollowersByMonth = groupBy<NotificationFollowUser>((user) => {
    const eventDate = new Date(`${user?.updatedAt}Z`);
    return format(eventDate, 'MMMM y');
  })(followingUsers ?? []);

  if (isLoading) {
    return (
      <Page title="Notifications">
        <Body>
          <Container>
            <PageHeader>Notifications</PageHeader>
            <Box
              css={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '$7',
              }}
            >
              <GraySquare height={22} />
            </Box>
            <SkeletonArray />
          </Container>
        </Body>
      </Page>
    );
  }

  return (
    <Page title="Notifications">
      <Body>
        <Container>
          <PageHeader>Notifications</PageHeader>
          {Object.entries(groupedFollowersByMonth)?.map(([key, users]) => {
            return (
              <MonthWrapper key={key}>
                <MonthHeader>{key}</MonthHeader>
                {users.map((user) => (
                  <NotificationFollow
                    className={notificationFollowStyles()}
                    key={user?.user?.publicKey}
                    followerUser={user}
                    currentUserPublicKey={currentUserPublicKey}
                    token={token}
                  />
                ))}
              </MonthWrapper>
            );
          })}
          <InfiniteScrollButton
            handleNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
          />
        </Container>
      </Body>
    </Page>
  );
}

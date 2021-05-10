import { styled, css } from 'stitches.config';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NotificationFollow from './NotificationFollow';

import { NotificationFollowUser } from 'types/Notification';

const Container = styled(Box, {
  width: 550,
  position: 'absolute',
  right: 0,
  bottom: -30,
  transform: 'translateY(100%)',
  backgroundColor: '$white100',
  borderRadius: '$2',
  boxShadow: '$1',
  zIndex: 10,
  paddingX: '$5',
  paddingY: '$5',
});

const Header = styled(Flex, {
  alignItems: 'center',
  marginBottom: '$3',
});

const Title = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$2',
  color: '$black100',
});

const ViewAllLink = styled(Box, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
  color: '$black40',
  textDecoration: 'none',
  transition: 'color $1 $ease',
  marginLeft: 'auto',
  '&:hover': { color: '$black100' },
  variants: {
    hasNoNotifications: {
      true: {
        '&:hover': { color: '$black40' },
        cursor: 'default',
      },
    },
  },
});

const NotificationCount = styled(Flex, {
  display: 'none',
  alignItems: 'center',
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
  backgroundColor: '$red100',
  borderRadius: '$round',
  paddingX: '$2',
  color: '$white100',
  marginRight: '$2',
  minWidth: 25,
  height: 25,
  variants: {
    hasUnread: {
      true: {
        display: 'flex',
      },
    },
  },
});

const notificationFollowStyles = css({
  '&:hover': {
    backgroundColor: '$black5',
  },
});

interface NotificationsPanel {
  unreadCount: number;
  follows: NotificationFollowUser[];
  currentUserPublicKey: string;
  token: string;
  lastReadNotificationTimestamp: string;
}

export default function NotificationsPanel(
  props: NotificationsPanel
): JSX.Element {
  const {
    unreadCount,
    follows,
    currentUserPublicKey,
    token,
    lastReadNotificationTimestamp,
  } = props;

  const hasUnread = unreadCount > 0;

  const cappedUnreadCount = unreadCount > 99 ? '99+' : unreadCount;

  const hasNoNotifications = follows.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Container>
        <Header>
          <NotificationCount hasUnread={hasUnread}>
            {cappedUnreadCount}
          </NotificationCount>
          <Title>Notifications</Title>
          <Link href="/notifications">
            <ViewAllLink as="a" hasNoNotifications={hasNoNotifications}>
              View all
            </ViewAllLink>
          </Link>
        </Header>
        {hasNoNotifications ? (
          <NoNotifications />
        ) : (
          follows?.map((f) => (
            <NotificationFollow
              className={notificationFollowStyles()}
              key={f.user.publicKey}
              followerUser={f}
              currentUserPublicKey={currentUserPublicKey}
              token={token}
              lastReadNotificationTimestamp={lastReadNotificationTimestamp}
            />
          ))
        )}
      </Container>
    </motion.div>
  );
}

function NoNotifications() {
  return (
    <Text
      css={{
        fontFamily: '$body',
        color: '$black40',
        fontWeight: 600,
        textAlign: 'center',
        marginY: '$6',
      }}
    >
      You have no notifications yet.
    </Text>
  );
}

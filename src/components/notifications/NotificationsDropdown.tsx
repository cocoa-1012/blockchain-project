import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import Box from 'components/base/Box';
import NotificationsButton from './NotificationsButton';
import NotificationsPanel from './NotificationsPanel';

import { setLastReadNotificationTimestamp } from 'queries/hasura/notifications';

import useLastReadNotificationsTimestamp from 'hooks/queries/hasura/use-last-read-notification-timestamp';
import useRecentFollows from 'hooks/queries/hasura/use-recent-follows';
import useNotificationsCount from 'hooks/queries/hasura/use-notifications-count';
import useAuthToken from 'hooks/queries/use-auth-token';
import { QueryCacheKey } from 'types/Queries';

export default function NotificationsDropdown(): JSX.Element {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useClickAway(containerRef, () => {
    queryClient.invalidateQueries(QueryCacheKey.LastReadNotificatonTimestamp);
    setIsOpen(false);
  });

  // close the nav on route change
  useEffect(() => {
    queryClient.invalidateQueries(QueryCacheKey.LastReadNotificatonTimestamp);
    setIsOpen(false);
  }, [queryClient, router.asPath]);

  const { user } = useAuthToken();
  const publicKey = user?.publicAddress;
  const token = user?.token;

  const {
    data: lastReadNotificationTimestampData,
    isSuccess: lastReadNotificationTimestampSuccess,
  } = useLastReadNotificationsTimestamp({ publicKey });

  const { data: recentFollows } = useRecentFollows({ publicKey });

  const { data: notificationsCountData } = useNotificationsCount({
    publicKey,
    lastReadTimestamp:
      lastReadNotificationTimestampData?.user?.lastReadNotificationsAt,
    enabled: lastReadNotificationTimestampSuccess,
  });

  const { mutate: setLastReadNotificationTimestampMutation } = useMutation(() =>
    setLastReadNotificationTimestamp(token)
  );

  const unreadCount =
    notificationsCountData?.notificationsCount?.aggregate?.count;
  const hasUnread = unreadCount > 0;
  const follows = recentFollows?.follow;
  const lastReadNotificationTimestamp =
    lastReadNotificationTimestampData?.user?.lastReadNotificationsAt;

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
    setLastReadNotificationTimestampMutation();
  };

  return (
    <Box ref={containerRef} css={{ position: 'relative', marginRight: '$6' }}>
      <NotificationsButton onClick={togglePanel} hasUnread={hasUnread} />
      <AnimatePresence>
        {isOpen && (
          <NotificationsPanel
            unreadCount={unreadCount}
            follows={follows}
            currentUserPublicKey={publicKey}
            token={token}
            lastReadNotificationTimestamp={lastReadNotificationTimestamp}
          />
        )}
      </AnimatePresence>
    </Box>
  );
}

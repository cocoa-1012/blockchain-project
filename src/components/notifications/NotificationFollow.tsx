import Link from 'next/link';
import { styled } from 'stitches.config';
import { isAfter } from 'date-fns';
import { useQueryClient } from 'react-query';

import FollowButtonConnected from 'components/follows/FollowButtonConnected';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import CircleAvatar from 'components/avatars/CircleAvatar';
import { NotificationFollowUser } from 'types/Notification';
import { buildUserProfilePath } from 'utils/artwork/artwork';
import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { formatRelativeTimestamp } from 'utils/dates/dates';

import { QueryCacheKey } from 'types/Queries';

const Container = styled(Flex, {
  alignItems: 'center',
  position: 'relative',
  borderRadius: '$2',
  paddingX: '$6',
  paddingY: '$6',
  cursor: 'pointer',
  transition: 'background-color $2 $ease',
  backgroundColor: '$white100',
});

const ProfileLink = styled(Box, {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});

const TimeAgo = styled(Text, {
  fontFamily: '$body',
  fontSize: '$0',
  color: '$black50',
});

const ContentWrapper = styled(Flex, {
  marginBottom: '$1',
  alignItems: 'baseline',
});

// TODO: consolidate this into a re-usable component
const Username = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
  color: '$black60',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  variants: {
    noUsername: {
      true: { fontFamily: '$mono', fontSize: '$0' },
    },
  },
});

const Event = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
  color: '$black100',
  marginLeft: '$1',
  flexShrink: 0,
});

const UnreadStatus = styled(Box, {
  position: 'absolute',
  bottom: -2,
  right: -4,
  width: 18,
  height: 18,
  border: '4px solid $white100',
  backgroundColor: '$red100',
  borderRadius: '$round',
  zIndex: '2',
  display: 'none',
  variants: {
    isNew: {
      true: {
        display: 'block',
      },
    },
  },
});

interface NotificationFollowProps {
  followerUser: NotificationFollowUser;
  currentUserPublicKey: string;
  token: string;
  lastReadNotificationTimestamp?: string;
  className?: string;
}

export default function NotificationFollow(
  props: NotificationFollowProps
): JSX.Element {
  const {
    token,
    currentUserPublicKey,
    followerUser,
    lastReadNotificationTimestamp,
    className,
  } = props;

  const profilePath = buildUserProfilePath({ user: followerUser?.user });
  const userHasUsername = hasUsername(followerUser?.user);
  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(
    followerUser?.user
  );
  const isCurrentUserFollowing = followerUser?.user?.follows.length > 0;

  const followedAtTimestamp = followerUser?.updatedAt;

  const relativeFollowedAtTimestamp = formatRelativeTimestamp(
    followedAtTimestamp
  );

  const queryClient = useQueryClient();

  const onFollowSuccess = () => {
    queryClient.invalidateQueries(QueryCacheKey.RecentFollows);
    queryClient.invalidateQueries(QueryCacheKey.NotificationsFollows);
  };

  const isNew = isAfter(
    new Date(followedAtTimestamp),
    new Date(lastReadNotificationTimestamp)
  );

  return (
    <Container className={className}>
      <Link href={profilePath}>
        <ProfileLink as="a"></ProfileLink>
      </Link>
      <Box css={{ marginRight: '$3', position: 'relative' }}>
        <CircleAvatar
          size={50}
          userIndex={followerUser?.user?.userIndex}
          imageUrl={followerUser?.user?.profileImageUrl}
        />
        <UnreadStatus isNew={isNew} />
      </Box>
      <Box css={{ marginRight: '$5', flexGrow: 0, minWidth: 0 }}>
        <ContentWrapper>
          <Username noUsername={!userHasUsername}>
            {usernameOrTruncatedAddress}
          </Username>
          <Event>followed you</Event>
        </ContentWrapper>
        <TimeAgo>{relativeFollowedAtTimestamp}</TimeAgo>
      </Box>
      <Box css={{ marginLeft: 'auto' }}>
        <FollowButtonConnected
          publicKey={followerUser?.user?.publicKey}
          currentUserPublicKey={currentUserPublicKey}
          token={token}
          isFollowing={isCurrentUserFollowing}
          onFollowSuccess={onFollowSuccess}
          isLoading={!followerUser}
        />
      </Box>
    </Container>
  );
}

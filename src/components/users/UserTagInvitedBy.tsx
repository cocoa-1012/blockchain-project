/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, ThemeUIStyleObject } from 'theme-ui';
import { ReactNode } from 'react';

import { useUsernameByPublicKey } from 'hooks/queries/use-user-by-public-key';

import Account from 'types/Account';
import InviteCode from 'types/InviteCode';

import {
  getUsernameOrAddress,
  getUsernameOrTruncatedAddress,
  hasUsername,
} from 'utils/helpers';
import { maybeLowerCase } from 'utils/case';

import { userTag, userLink } from './styles';

import Link from 'components/links/Link';
import CircleAvatar from 'components/avatars/CircleAvatar';
import UserTagContainer from './UserTagContainer';

interface UserTagProps {
  invite: InviteCode;
  className?: string;
}

export default function UserTagInvitedBy(props: UserTagProps): JSX.Element {
  const { invite } = props;

  const inviteSenderPublicKey = invite?.senderPublicKey;

  const { data, isLoading } = useUsernameByPublicKey({
    publicKey: inviteSenderPublicKey,
    refetchOnWindowFocus: false,
  });

  const fallbackUser: Account = { publicKey: inviteSenderPublicKey };

  const user = data?.user ?? fallbackUser;

  if (user?.isAdmin || !inviteSenderPublicKey || isLoading) {
    return null;
  }

  return (
    <UserTagInvitedByContainer user={user}>
      <UserTagInviteByContent user={user} />
    </UserTagInvitedByContainer>
  );
}

interface UserTagInvitedByContainerProps {
  user: Account;
  children: ReactNode;
}

export function UserTagInvitedByContainer(
  props: UserTagInvitedByContainerProps
): JSX.Element {
  const { user, children } = props;

  const usernameOrAddress = getUsernameOrAddress(user);

  const tagStyles: ThemeUIStyleObject = {
    ...userTag,
    paddingLeft: ['s', 's'],
    padding: [10, 10],
  };

  if (!usernameOrAddress) {
    return (
      <UserTagContainer sx={tagStyles}>
        <Flex sx={{ ...userLink, pointerEvents: 'none' }}>{children}</Flex>
      </UserTagContainer>
    );
  }

  return (
    <Link href={`/${usernameOrAddress}`}>
      <a sx={userLink}>
        <Flex sx={tagStyles}>{children}</Flex>
      </a>
    </Link>
  );
}

interface UserTagInviteByContentProps {
  user: Account;
}

function UserTagInviteByContent(
  props: UserTagInviteByContentProps
): JSX.Element {
  const { user } = props;

  const usernameOrAddress = getUsernameOrTruncatedAddress(user);

  const hasClaimedUsername = hasUsername(user);

  const avatarUrl = user?.profileImageUrl;

  return (
    <>
      <UserTagText>
        <Text variant="h.sub" sx={{ marginRight: '0.5ch' }}>
          Invited by
        </Text>
        <Text variant={hasClaimedUsername ? 'h.sub' : 'mono.sub'}>
          {maybeLowerCase(usernameOrAddress)}
        </Text>
      </UserTagText>
      <CircleAvatar
        size={24}
        userIndex={user?.userIndex}
        imageUrl={avatarUrl}
        sx={{ marginRight: 0 }}
      />
    </>
  );
}

interface UserTagTextProps {
  children: ReactNode;
  className?: string;
}

function UserTagText(props: UserTagTextProps): JSX.Element {
  const { children, className } = props;
  return (
    <Text
      className={className}
      variant="h.body"
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'black.100',
        position: 'relative',
        top: -1,
        fontSize: ['sub', 'body'],
        textDecoration: 'none',
        marginRight: 12,
      }}
    >
      {children}
    </Text>
  );
}

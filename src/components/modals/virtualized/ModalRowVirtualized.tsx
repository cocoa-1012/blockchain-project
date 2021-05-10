/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, ThemeUIStyleObject, Heading, Text, Grid } from 'theme-ui';

import {
  getUsernameOrTruncatedAddress,
  getUsernameOrAddress,
  hasUsername,
} from 'utils/helpers';
import { transitions } from 'utils/themes/main/theme';
import { areKeysEqual } from 'utils/users';

import FollowButtonConnected from 'components/follows/FollowButtonConnected';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/links/Link';

import useAuthToken from 'hooks/queries/use-auth-token';

import { CardDimension } from 'types/Card';
import Account from 'types/Account';

interface ModalRowVirtualizedProps {
  user: Account;
  onFollowUpdate: () => void;
  isLoading: boolean;
  isFollowing: boolean;
}

export default function ModalRowVirtualized(
  props: ModalRowVirtualizedProps
): JSX.Element {
  const { user, isFollowing, onFollowUpdate, isLoading } = props;

  const sx = getStyles();

  const { user: walletUser } = useAuthToken();

  const publicKey = user.publicKey;

  const currentUserPublicAddress = walletUser?.publicAddress;
  const token = walletUser?.token;

  const isMyProfile = areKeysEqual([publicKey, currentUserPublicAddress]);

  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);
  const usernameOrAddress = getUsernameOrAddress(user);
  const userHasUsername = hasUsername(user);
  const userFullName = user.name;

  return (
    <Flex sx={sx.row}>
      <Link href={`/${usernameOrAddress}`}>
        <a sx={sx.link}>
          <CircleAvatar
            size={[32, 50]}
            userIndex={user.userIndex}
            imageUrl={user.profileImageUrl}
            sx={{ marginRight: ['s', 'm'] }}
          />
          <Grid>
            {userFullName && (
              <Heading
                variant="h.s"
                sx={{ color: 'black.100', fontSize: ['xs', 's'] }}
              >
                {userFullName}
              </Heading>
            )}

            <Heading
              variant={userHasUsername ? 'h.body' : 'mono.xs'}
              sx={{ display: 'flex', color: 'black.100' }}
            >
              <Text
                variant={userHasUsername ? 'gradient' : null}
                sx={{ fontFamily: 'inherit' }}
              >
                {usernameOrTruncatedAddress}
              </Text>
            </Heading>
          </Grid>
        </a>
      </Link>
      {!isMyProfile && (
        <Flex sx={{ display: ['none', 'flex'] }}>
          <FollowButtonConnected
            isFollowing={isFollowing}
            isLoading={isLoading}
            publicKey={publicKey}
            currentUserPublicKey={currentUserPublicAddress}
            token={token}
            onFollowSuccess={onFollowUpdate}
            size={CardDimension.large}
          />
        </Flex>
      )}
    </Flex>
  );
}

const getStyles = () => {
  const row: ThemeUIStyleObject = {
    alignItems: 'center',
    paddingRight: [0, 20],
    transition: transitions.smooth.fast,
    borderRadius: [0, 10],
    flex: 1,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: 'black.5',
      },
    },
  };
  const link: ThemeUIStyleObject = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    textDecoration: 'none',
    paddingY: ['xs', 'm'],
    paddingLeft: ['m', 'm'],
    paddingRight: ['m', 0],
  };
  return { row, link };
};

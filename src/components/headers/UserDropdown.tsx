/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { useToggle, useClickAway } from 'react-use';
import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useInviteCount from 'hooks/queries/hasura/use-invite-count';
import useBalance from 'hooks/queries/use-balance';

import UserDropdownButton from './UserDropdownButton';
import UserDropdownDetails from './UserDropdownDetails';

import { buildAvatarUrlNew } from 'utils/assets';

interface UserDropdownProps {
  bidCount: number;
}

export default function UserDropdown(props: UserDropdownProps): JSX.Element {
  const { bidCount } = props;

  const router = useRouter();
  const ref = useRef(null);
  const [isOpen, toggleNav] = useToggle(false);

  // close the nav on route change
  useEffect(() => {
    toggleNav(false);
  }, [toggleNav, router.asPath]);

  useClickAway(ref, () => {
    toggleNav(false);
  });

  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const { data: userData } = useUserByPublicKey({
    publicKey: publicAddress,
    refetchOnWindowFocus: false,
  });

  const publicKey = user?.publicAddress;
  const profileImageUrl = userData?.user?.profileImageUrl;
  const avatarUrl = buildAvatarUrlNew(profileImageUrl);

  const { data: userInviteData } = useInviteCount({ publicKey: publicAddress });

  const inviteCount: number =
    userInviteData?.inviteCount?.aggregate?.count ?? 0;

  const { data: balance, isLoading: isBalanceLoading } = useBalance();

  const isLoading = isUserLoading || isBalanceLoading;

  return (
    <Box
      ref={ref}
      sx={{
        userSelect: 'none',
        marginLeft: 'auto',
        color: 'black.100',
      }}
    >
      <Box onClick={toggleNav}>
        <UserDropdownButton
          isLoading={isLoading}
          balance={balance}
          avatarUrl={avatarUrl}
          publicKey={publicKey}
        />
      </Box>

      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <Box>
            <UserDropdownDetails
              user={user}
              avatarUrl={avatarUrl}
              canInviteCreators={inviteCount > 0}
              bidCount={bidCount}
            />
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}

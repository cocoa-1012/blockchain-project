/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { useRouter } from 'next/router';

import { useExternalWalletLogout } from 'utils/auth';

import LogOutIcon from 'assets/icons/log-out-icon.svg';
import SupportIcon from 'assets/icons/support-icon.svg';
import InviteIcon from 'assets/icons/invite-icon.svg';
import BidsIcon from 'assets/icons/bids-icon.svg';
import SettingsIcon from 'assets/icons/settings-icon.svg';

import CreateProfileLink from './CreateProfileLink';
import UserDropdownLink from './UserDropdownLink';

import WalletUser from 'types/WalletUser';
import HeaderBidsCount from './HeaderBidsCount';

interface UserDropdownDetailsProps {
  user: WalletUser;
  avatarUrl?: string;
  canInviteCreators: boolean;
  bidCount: number;
}

export default function UserDropdownDetails(
  props: UserDropdownDetailsProps
): JSX.Element {
  const { user, avatarUrl, canInviteCreators = false, bidCount } = props;
  const router = useRouter();
  const handleLogout = useExternalWalletLogout();

  const breakpointIndex = useBreakpointIndex({ defaultIndex: 2 });

  const isMobile = breakpointIndex <= 1;

  const handleDisconnect = async () => {
    await handleLogout();
    await router.push('/');
  };

  return (
    <Box
      sx={{
        minWidth: ['calc(100vw - 48px)', 300],
        boxShadow: 'm',
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 16px)',
        zIndex: 9999,
        bg: 'white.100',
        borderRadius: 10,
      }}
    >
      <Box>
        <CreateProfileLink
          user={user}
          avatarUrl={avatarUrl}
          sx={{
            paddingX: 'm',
            paddingY: 's',
            boxShadow: 's',
            borderRadius: 10,
          }}
        />
      </Box>

      <Box sx={{ paddingX: 'm' }}>
        {isMobile && (
          <UserDropdownLink
            href="/bids"
            icon={<BidsIcon width={22} height={14} sx={{ display: 'block' }} />}
          >
            <Flex sx={{ alignItems: 'center', flex: 1 }}>
              <Flex sx={{ flex: 1 }}>Bids</Flex>
              {bidCount > 0 && (
                <Flex sx={{ marginRight: 's', marginY: -5 }}>
                  <HeaderBidsCount count={bidCount} />
                </Flex>
              )}
            </Flex>
          </UserDropdownLink>
        )}
        {canInviteCreators && (
          <UserDropdownLink
            href="/invite"
            icon={
              <InviteIcon width={20} height={21} sx={{ display: 'block' }} />
            }
          >
            Invite a Creator
          </UserDropdownLink>
        )}
        <UserDropdownLink
          href="/settings"
          icon={
            <SettingsIcon width={24} height={29} sx={{ display: 'block' }} />
          }
        >
          Settings
        </UserDropdownLink>
        <UserDropdownLink
          href="https://help.foundation.app"
          icon={
            <SupportIcon width={24} height={29} sx={{ display: 'block' }} />
          }
        >
          Support
        </UserDropdownLink>

        <UserDropdownLink
          onClick={handleDisconnect}
          icon={<LogOutIcon width={24} height={24} sx={{ display: 'block' }} />}
        >
          Disconnect
        </UserDropdownLink>
      </Box>
    </Box>
  );
}

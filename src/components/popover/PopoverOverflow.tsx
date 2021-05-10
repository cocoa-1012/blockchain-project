/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import { TippyProps } from '@tippyjs/react';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import EllipsisIcon from 'assets/icons/ellipsis.svg';
import NotAllowedIcon from 'assets/icons/not-allowed.svg';
import AdminShield from 'assets/icons/admin-shield.svg';

import Popover from './Popover';
import PopoverButton from './PopoverButton';
import PopoverMenu from './PopoverMenu';

import { StyleObject } from 'types/styles';
import { PopoverMenuOption } from './types';
import { ModalKey } from 'types/modal';

import { transitions } from 'utils/themes/main/theme';
import useModal from 'hooks/use-modal';

interface PopoverOverflowProps extends TippyProps {
  className?: string;
  showInvites?: boolean;
}

interface CreateMenuItemsProps {
  isAdmin: boolean;
  showInvites?: boolean;
  setCurrentModal: (value: ModalKey) => void;
}

const createMenuItems = ({
  isAdmin,
  showInvites,
  setCurrentModal,
}: CreateMenuItemsProps): PopoverMenuOption[] => {
  let options: PopoverMenuOption[] = [
    {
      icon: <NotAllowedIcon />,
      children: 'Report',
      sx: { color: 'red.100' },
      onClick: () => {
        return setCurrentModal(ModalKey.REPORT);
      },
    },
  ];

  if (isAdmin) {
    options = [
      {
        icon: <AdminShield />,
        children: 'Admin Tools',
        onClick: () => {
          return setCurrentModal(ModalKey.ADMIN_TOOLS);
        },
      },
      {
        icon: <AdminShield />,
        children: 'Change Status',
        onClick: () => {
          return setCurrentModal(ModalKey.CHANGE_STATUS_ADMIN);
        },
      },
      ...options,
    ];
  }

  if (isAdmin && showInvites) {
    options = [
      {
        icon: <AdminShield />,
        children: 'Give Invites',
        onClick: () => {
          return setCurrentModal(ModalKey.GIVE_INVITES_ADMIN);
        },
      },
      ...options,
    ];
  }

  return options;
};

export default function PopoverOverflow(
  props: PopoverOverflowProps
): JSX.Element {
  const { className, placement = 'top-end', showInvites } = props;

  const { setCurrentModal } = useModal();

  const { user } = useAuthToken();
  const { data: currentUserData } = useUserByPublicKey({
    publicKey: user?.publicAddress,
    refetchOnWindowFocus: false,
  });

  const currentUserIsAdmin = currentUserData?.user?.isAdmin;

  const sx = getStyles();

  const options = createMenuItems({
    isAdmin: currentUserIsAdmin,
    showInvites: showInvites,
    setCurrentModal,
  });

  return (
    <Flex>
      <Popover
        sx={sx.popover}
        button={
          <PopoverButton sx={sx.button}>
            <Box sx={{ transform: [`scale(0.85)`, `scale(1)`] }}>
              <EllipsisIcon sx={{ display: 'block' }} width={22} />
            </Box>
          </PopoverButton>
        }
        className={className}
        placement={placement}
      >
        <PopoverMenu options={options} />
      </Popover>
    </Flex>
  );
}

const getStyles = (): StyleObject => ({
  popover: {
    outline: 'none',
    transition: transitions.smooth.fast,
    borderRadius: 999,
    willChange: 'transform',
    backfaceVisibility: 'visible',
    mr: 'm',

    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
  },
  button: {
    backgroundColor: '#fff !important',
    display: 'flex',
    alignItems: 'center',
    minHeight: [40],
  },
});

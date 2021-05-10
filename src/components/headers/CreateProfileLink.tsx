/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Text, ThemeUIStyleObject } from 'theme-ui';

import { transitions } from 'utils/themes/main/theme';
import { getUsernameOrAddress } from 'utils/helpers';

import Account from 'types/Account';

import RightChevron from 'assets/icons/right-chevron.svg';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/links/Link';

interface CreateProfileLinkProps {
  avatarUrl?: string;
  className?: string;
  user: Account;
}

export default function CreateProfileLink(
  props: CreateProfileLinkProps
): JSX.Element {
  const { avatarUrl, user, className } = props;

  const sx = getStyles();

  const profileHref = `/${getUsernameOrAddress(user)}`;

  return (
    <Link href={profileHref}>
      <a sx={sx.link} className={className}>
        <Flex sx={{ alignItems: 'center' }}>
          <Flex sx={sx.label} className="label">
            <CircleAvatar size={44} imageUrl={avatarUrl} />
            <Flex sx={{ flex: 'auto', marginLeft: 's', alignItems: 'center' }}>
              <Text variant="h.xs">View Your Profile</Text>
            </Flex>
          </Flex>

          <Box sx={{ marginLeft: 'auto' }}>
            <RightChevron sx={{ display: 'block' }} />
          </Box>
        </Flex>
      </a>
    </Link>
  );
}

const getStyles = () => {
  const link: ThemeUIStyleObject = {
    display: 'block',
    borderRadius: 8,
    color: 'black.100',
    textDecoration: 'none',
    '@media (hover: hover)': {
      '&:hover .label': {
        transform: 'translate3d(5px, 0, 0)',
      },
    },
  };

  const label: ThemeUIStyleObject = {
    flex: 1,
    transition: transitions.smooth.fast,
  };

  return {
    link,
    label,
  };
};

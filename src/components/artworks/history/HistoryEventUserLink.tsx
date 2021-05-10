/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import Account from 'types/Account';

import {
  getBuyerUsernameOrAddressInfo,
  getUsernameOrAddress,
} from 'utils/helpers';

import InternalInlineLink from 'components/links/InternalInlineLink';
import FollowPopover from 'components/follows/FollowPopover';

interface HistoryEventUserLinkProps {
  user: Account;
  className?: string;
}

export default function HistoryEventUserLink(
  props: HistoryEventUserLinkProps
): JSX.Element {
  const { user, className } = props;

  const { usernameOrAddress, isAddress } = getBuyerUsernameOrAddressInfo(user);

  return (
    <FollowPopover publicKey={user?.publicKey} sx={{ display: 'inline-block' }}>
      <InternalInlineLink
        variant={isAddress ? 'mono.body' : 'h.body'}
        href={`/${getUsernameOrAddress(user)}`}
        className={className}
      >
        {usernameOrAddress}
      </InternalInlineLink>
    </FollowPopover>
  );
}

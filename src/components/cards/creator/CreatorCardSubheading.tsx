/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import Account from 'types/Account';

import { getBuyerUsernameOrAddressInfo } from 'utils/helpers';

import CardSubHeading from '../CardSubheading';

interface CreatorCardSubheadingProps {
  user: Account;
}

export default function CreatorCardSubheading(
  props: CreatorCardSubheadingProps
): JSX.Element {
  const { user } = props;

  const {
    isAddress,
    usernameOrAddress,
    hasName,
  } = getBuyerUsernameOrAddressInfo(user);

  if (isAddress || !hasName) {
    return null;
  }

  return <CardSubHeading>{usernameOrAddress}</CardSubHeading>;
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, ThemeUIStyleObject } from 'theme-ui';

import CardHeading from '../CardHeading';

import Account from 'types/Account';

import { getBuyerUsernameOrAddressInfo } from 'utils/helpers';

interface CreatorCardHeadingProps {
  user: Account;
}

export default function CreatorCardHeading(
  props: CreatorCardHeadingProps
): JSX.Element {
  const { user } = props;

  const sx = getStyles();

  const {
    isAddress,
    usernameOrAddress,
    nameOrUsername,
    hasName,
  } = getBuyerUsernameOrAddressInfo(user);

  if (isAddress) {
    return <CardHeading sx={sx.heading}>{usernameOrAddress}</CardHeading>;
  }

  if (!hasName) {
    return (
      <CardHeading>
        <Text variant="gradient">{usernameOrAddress}</Text>
      </CardHeading>
    );
  }

  return <CardHeading>{nameOrUsername}</CardHeading>;
}

const getStyles = () => {
  const heading: ThemeUIStyleObject = {
    fontFamily: 'mono',
    fontSize: 's',
    fontWeight: 400,
    letterSpacing: 0.5,
  };
  return { heading };
};

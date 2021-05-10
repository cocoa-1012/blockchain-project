/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject } from 'theme-ui';

import AuthHeader from 'components/headers/AuthHeader';
import MinimalHeader from 'components/headers/MinimalHeader';
import LoadingHeader from 'components/headers/LoadingHeader';
import DefaultHeader from 'components/headers/DefaultHeader';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { isAccountApprovedCreator } from 'utils/users';

import { PageColorMode, PageTypes } from 'types/page';

interface HeaderProps {
  mode: PageColorMode;
  headerMode: PageColorMode;
  absolute: boolean;
  headerStyle: ThemeUIStyleObject;
  type: PageTypes;
  bannerActive?: boolean;
}

export default function Header(props: HeaderProps): JSX.Element {
  const {
    mode = PageColorMode.light,
    headerMode = PageColorMode.light,
    absolute = false,
    headerStyle,
    type,
    bannerActive,
  } = props;

  const isDark = [mode, headerMode].includes(PageColorMode.dark);

  const color = isDark ? 'white.100' : 'black.100';

  const { user, isLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const { data: serverUserData } = useUserByPublicKey({
    publicKey: publicAddress,
    refetchOnWindowFocus: false,
  });

  const isApprovedCreator = isAccountApprovedCreator(serverUserData?.user);

  const sharedHeaderProps = {
    absolute,
    color,
    sx: headerStyle,
    mode: headerMode,
    isDark,
  };

  if (isLoading) {
    return <LoadingHeader {...sharedHeaderProps} />;
  }

  if (type === PageTypes.minimal) {
    return <MinimalHeader {...sharedHeaderProps} />;
  }

  if (publicAddress) {
    return (
      <AuthHeader
        {...sharedHeaderProps}
        publicAddress={publicAddress}
        isApprovedCreator={isApprovedCreator}
      />
    );
  }

  return (
    <DefaultHeader
      {...sharedHeaderProps}
      isDark={isDark}
      bannerActive={bannerActive}
    />
  );
}

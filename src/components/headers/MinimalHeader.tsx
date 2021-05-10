/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import LogoLink from 'components/links/LogoLink';

import HeaderContainer from './HeaderContainer';

import { SharedHeaderProps } from './types';

export default function MinimalHeader(props: SharedHeaderProps): JSX.Element {
  const { color, absolute, className } = props;

  return (
    <HeaderContainer
      absolute={absolute}
      className={className}
      sx={{ justifyContent: 'center' }}
    >
      <LogoLink color={color} />
    </HeaderContainer>
  );
}

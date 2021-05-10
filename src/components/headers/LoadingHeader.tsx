/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';

import LogoLink from 'components/links/LogoLink';
import SpinnerStroked from '../SpinnerStroked';
import HeaderContainer from './HeaderContainer';
import SearchBar from 'components/search/SearchBar';

import { SharedHeaderProps } from './types';
import { headerContainerStyles } from './styles';
import SubNav from './SubNav';

export default function LoadingHeader(props: SharedHeaderProps): JSX.Element {
  const { color, absolute, className, mode, isDark } = props;

  return (
    <HeaderContainer absolute={absolute} className={className}>
      <Flex sx={headerContainerStyles}>
        <Flex sx={{ color }}>
          <LogoLink color={color} />
        </Flex>

        <SearchBar pageColorMode={mode} searchOpen={false} />

        <Box
          sx={{
            padding: 12,
            backgroundColor: 'white.100',
            color: 'black.100',
            borderRadius: 999,
            boxShadow: 's',
          }}
        >
          <SpinnerStroked size={30} />
        </Box>
      </Flex>

      <SubNav showLoadingAnimation isDark={isDark} />
    </HeaderContainer>
  );
}

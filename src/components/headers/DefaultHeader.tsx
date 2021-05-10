/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';
import { useEffect, useState } from 'react';
import { useMeasure } from 'react-use';

import HeaderContainer from './HeaderContainer';
import LogoLink from 'components/links/LogoLink';
import ConnectWalletButton from './ConnectWalletButton';
import SearchBar from 'components/search/SearchBar';
import MobileHeader from './MobileHeader';
import MobileHeaderOpenButton from './MobileHeaderOpenButton';
import MobileHeaderSearchButton from './MobileHeaderSearchButton';

import { headerContainerStyles, overlayStyles } from './styles';
import { PageColorMode } from 'types/page';
import SubNav from './SubNav';

interface DefaultHeaderProps {
  absolute: boolean;
  className?: string;
  color: string;
  isDark?: boolean;
  mode: PageColorMode;
  bannerActive?: boolean;
}

export default function DefaultHeader(props: DefaultHeaderProps): JSX.Element {
  const { absolute, className, color, isDark, mode, bannerActive } = props;

  const [isNavOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [measureRef, { height: viewportHeight }] = useMeasure();

  const logoColor = isNavOpen ? 'black.100' : color;

  useEffect(() => {
    setNavOpen(false);
  }, [searchOpen]);

  return (
    <>
      <Box sx={overlayStyles} ref={measureRef} />
      <MobileHeader
        viewportHeight={viewportHeight}
        isOpen={isNavOpen}
        isConnected={false}
        bannerActive={bannerActive}
      />

      <Box sx={{ position: 'relative' }}>
        <HeaderContainer absolute={absolute} className={className}>
          <Flex className="header-inner" sx={headerContainerStyles}>
            {!searchOpen && (
              <Flex sx={{ color: logoColor }}>
                <LogoLink color={logoColor} />
              </Flex>
            )}

            <SearchBar pageColorMode={mode} searchOpen={searchOpen} />

            <Flex>
              {!isNavOpen && (
                <ConnectWalletButton
                  isDark={isDark}
                  sx={{ display: ['none', null, 'flex'] }}
                />
              )}

              <MobileHeaderSearchButton
                isOpen={searchOpen}
                setOpen={setSearchOpen}
              />

              {!searchOpen && (
                <MobileHeaderOpenButton
                  isOpen={isNavOpen}
                  setOpen={setNavOpen}
                />
              )}
            </Flex>
          </Flex>
          <SubNav isDark={isDark} />
        </HeaderContainer>
      </Box>
    </>
  );
}

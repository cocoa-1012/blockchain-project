/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Grid, Box, ThemeUIStyleObject } from 'theme-ui';
import { useLockBodyScroll } from 'react-use';

import Link from 'components/links/Link';
import ConnectWalletWideButton from './ConnectWalletWideButton';

import { flexDirectionForPrefix, positionFixed } from 'types/styles';

interface MobileHeaderProps {
  viewportHeight: number;
  isOpen: boolean;
  isConnected: boolean;
  bannerActive?: boolean;
}

export default function MobileHeader(props: MobileHeaderProps): JSX.Element {
  const { viewportHeight, isOpen, isConnected, bannerActive } = props;

  const sx = getSharedHeaderStyles();

  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      sx={sx.overlay}
      style={{ height: viewportHeight, paddingTop: bannerActive ? 150 : 96 }}
    >
      <Flex sx={sx.nav}>
        <Box>
          {mobileNavLinks.map((navLink) => (
            <Link href={navLink.href} key={navLink.href}>
              <Box
                as="a"
                variant="text.h.xs"
                sx={sx.link}
                style={{
                  display:
                    navLink.isAuthRoute && !isConnected ? 'none' : 'block',
                }}
              >
                {navLink.children}
              </Box>
            </Link>
          ))}
        </Box>

        <Grid sx={{ gap: 'm' }}>
          {!isConnected && <ConnectWalletWideButton />}

          <Grid sx={sx.grid} columns={2}>
            {secondaryLinks.map((navLink) => (
              <Link href={navLink.href} key={navLink.href}>
                <Box as="a" variant="text.h.xs" sx={sx.secondary}>
                  {navLink.children}
                </Box>
              </Link>
            ))}
          </Grid>
        </Grid>
      </Flex>
    </Box>
  );
}

export const getSharedHeaderStyles = () => {
  const overlay: ThemeUIStyleObject = {
    position: positionFixed,
    paddingTop: 96,
    paddingX: 'm',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    bg: 'white.100',
    display: 'flex',
    flexDirection: flexDirectionForPrefix,
    height: '100vh',
  };

  const grid: ThemeUIStyleObject = {
    mt: 'auto',
    columnGap: 'm',
    rowGap: 'xs',
    pb: 'l',
  };
  const header: ThemeUIStyleObject = {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    mb: 'l',
    minHeight: 54,
    maxHeight: 54,
  };
  const nav: ThemeUIStyleObject = {
    flexDirection: flexDirectionForPrefix,
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  };
  const link: ThemeUIStyleObject = {
    display: 'block',
    color: 'black.100',
    textDecoration: 'none',
    mr: 'l',
    fontSize: 'm',
    letterSpacing: -1,
    lineHeight: 1.2,
  };
  const secondary: ThemeUIStyleObject = {
    color: 'black.30',
    fontSize: 'sub',
    display: 'block',
    textDecoration: 'none',
  };

  return {
    overlay,
    grid,
    header,
    nav,
    link,
    secondary,
  };
};

const mobileNavLinks = [
  {
    href: '/feed',
    children: 'Feed',
    isAuthRoute: true,
  },
  {
    href: '/explore',
    children: 'Explore',
  },
  {
    href: '/blog',
    children: 'Blog',
  },
  {
    href: '/about',
    children: 'About',
  },
  {
    href: 'https://help.foundation.app',
    children: 'Help',
  },
  {
    children: 'Twitter',
    href: 'https://twitter.com/withfnd',
  },
  {
    children: 'Instagram',
    href: 'https://www.instagram.com/withfoundation/',
    external: true,
  },
];

const secondaryLinks = [
  {
    href: '/community-guidelines',
    children: 'Community Guidelines',
  },
  {
    href: '/terms',
    children: 'Terms of Service',
  },
  {
    href: '/privacy',
    children: 'Privacy',
  },
  {
    href: '/careers',
    children: 'Careers',
  },
];

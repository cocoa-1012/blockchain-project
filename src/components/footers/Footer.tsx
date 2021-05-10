/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, ThemeUIStyleObject, Flex } from 'theme-ui';
import { includes } from 'ramda';
import { ReactNode } from 'react';

import Body from 'components/Body';
import Link from 'components/links/Link';
import LogoLink from 'components/links/LogoLink';

import { PageTypes } from 'types/page';
import { transitions } from 'utils/themes/main/theme';
import MaximalFooter from './MaximalFooter';

interface SiteLink {
  children: ReactNode;
  href: string;
  external?: boolean;
}

const socialLinks: SiteLink[] = [
  {
    children: 'Instagram',
    href: 'https://www.instagram.com/withfoundation/',
    external: true,
  },
  { children: 'Twitter', href: 'https://twitter.com/withfnd', external: true },
  { children: 'Blog', href: '/blog' },
];

const otherLinks: SiteLink[] = [
  {
    children: 'About',
    href: '/about',
  },
  {
    children: 'Community Guidelines',
    href: '/community-guidelines',
  },
  {
    children: 'Terms of Service',
    href: '/terms',
  },
  {
    children: 'Privacy',
    href: '/privacy',
  },
  { children: 'Careers', href: '/careers' },
  {
    children: 'Help',
    href: 'https://help.foundation.app/',
    external: true,
  },
];

interface FooterProps {
  type?: string;
  footerStyle: ThemeUIStyleObject;
}

export default function Footer(props: FooterProps): JSX.Element {
  const { type, footerStyle } = props;

  const shouldHideFooter = includes(type, [PageTypes.auth, PageTypes.minimal]);

  const maximalFooter = includes(type, [PageTypes.maximal]);

  if (shouldHideFooter) {
    return null;
  }

  if (maximalFooter) {
    return <MaximalFooter />;
  }

  return (
    <Box sx={{ paddingY: 'xl', ...footerStyle }}>
      <Body>
        <Grid
          gap="m"
          sx={{
            gridTemplateColumns: 'repeat(6, 1fr)',
            display: ['grid', null, 'flex'],
            alignItems: ['flex-start', null, 'center'],
          }}
        >
          <Box sx={{ gridColumn: '1/7' }}>
            <Flex>
              <LogoLink width={65} color="black.10" />
            </Flex>
          </Box>
          <FooterLinkList sx={{ gridColumn: '1/3' }}>
            {socialLinks.map((link, key) => (
              <FooterLink {...link} key={key} />
            ))}
          </FooterLinkList>
          <FooterLinkList
            sx={{ gridColumn: '3/7', marginLeft: [null, null, 'auto'] }}
          >
            {otherLinks.map((link, key) => (
              <FooterLink {...link} key={key} />
            ))}
          </FooterLinkList>
        </Grid>
      </Body>
    </Box>
  );
}

interface FooterLinkListProps {
  className?: string;
  children: ReactNode;
}

function FooterLinkList(props: FooterLinkListProps): JSX.Element {
  const { children, className } = props;
  return (
    <Grid
      className={className}
      sx={{ gap: 5, display: ['grid', null, 'flex'] }}
    >
      {children}
    </Grid>
  );
}

function FooterLink(props: SiteLink): JSX.Element {
  const { external, children, href } = props;

  const sx = getStyles();

  if (external) {
    return (
      <a sx={sx.link} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href}>
      <a sx={sx.link}>{children}</a>
    </Link>
  );
}

const getStyles = () => {
  const link: ThemeUIStyleObject = {
    display: 'block',
    fontSize: 14,
    color: 'black.30',
    fontFamily: 'body',
    fontWeight: 600,
    textDecoration: 'none',
    marginRight: ['xs', null, 's'],
    transition: transitions.smooth.fast,
    '&:last-of-type': {
      marginRight: 0,
    },
    '@media (hover: hover)': {
      '&:hover': {
        color: 'black.60',
      },
    },
  };
  return { link };
};

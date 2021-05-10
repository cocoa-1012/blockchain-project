/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */

import { ReactNode } from 'react';

import Link from 'components/links/Link';
import Box from 'components/base/Box';
import Body from 'components/base/Body';
import Flex from 'components/base/Flex';
import Divider from 'components/Divider';
import Text from 'components/base/Text';
import Button from 'components/base/Button';

import InstagramIcon from 'assets/icons/instagram-icon.svg';
import TwitterIcon from 'assets/icons/twitter-icon.svg';
import FNDLogo from 'assets/images/fnd-logo.svg';

interface SiteLink {
  children: ReactNode;
  href: string;
  external?: boolean;
}

const otherLinks: SiteLink[] = [
  {
    children: 'Explore',
    href: '/explore',
  },
  {
    children: 'Blog',
    href: '/blog',
  },
  {
    children: 'About',
    href: '/about',
  },
  {
    children: 'Community Guidelines',
    href: '/community-guidelines',
  },
  { children: 'Careers', href: '/careers' },
  {
    children: 'Help',
    href: 'https://help.foundation.app/',
    external: true,
  },
];

const adminLinks: SiteLink[] = [
  {
    children: 'Terms of Service',
    href: '/terms',
  },
  {
    children: 'Privacy',
    href: '/privacy',
  },
];

export default function MaximalFooter(): JSX.Element {
  return (
    <Box
      as="footer"
      css={{
        backgroundColor: '$black100',
        color: '$black60',
        paddingY: '$5',
        zIndex: 1,
        '@bp1': {
          paddingY: '$8',
        },
      }}
    >
      <Body>
        <Flex
          css={{
            paddingBottom: '$5',
            flexDirection: 'column-reverse',
            justifyContent: 'space-between',
            '@bp1': {
              paddingBottom: '$9',
              flexDirection: 'row',
            },
          }}
        >
          <SubscribeModule />
          <Flex
            css={{
              flexDirection: 'column',
              '@bp1': {
                textAlign: 'right',
                alignItems: 'flex-end',
              },
              a: {
                fontSize: '$3',
                lineHeight: 1.4,
              },
            }}
          >
            {otherLinks.map((link, key) => (
              <FooterLink {...link} key={key} />
            ))}
          </Flex>
        </Flex>
        <Divider css={{ backgroundColor: '$black80' }} />
        <Flex
          css={{
            paddingTop: '$5',
            flexDirection: 'column',
            justifyContent: 'space-between',
            '@bp1': {
              paddingTop: '$7',
              flexDirection: 'row',
            },
          }}
        >
          <Box>
            <Flex
              css={{
                flexDirection: 'column',
                marginBottom: '$6',
                a: {
                  paddingBottom: '$2',
                },
                '@bp1': {
                  flexDirection: 'row',
                  marginBottom: 'unset',
                  a: {
                    paddingRight: '$6',
                    paddingBottom: 0,
                  },
                },
              }}
            >
              <FNDLogo
                width={65}
                style={{ color: '#fff', marginBottom: 20, marginRight: 37 }}
              />
              {adminLinks.map((link, key) => (
                <FooterLink {...link} key={key} css={{ marginRight: '$6' }} />
              ))}
            </Flex>
          </Box>
          <Box>
            <Flex
              css={{
                marginLeft: 0,

                '@bp1': { marginLeft: '$6' },
              }}
            >
              <FooterLink href="https://www.instagram.com/withfoundation/">
                <InstagramIcon
                  width={24}
                  height={24}
                  style={{ marginRight: 16 }}
                />
              </FooterLink>
              <FooterLink href="https://twitter.com/withfnd">
                <TwitterIcon width={24} height={24} />
              </FooterLink>
            </Flex>
          </Box>
        </Flex>
      </Body>
    </Box>
  );
}

function SubscribeModule() {
  return (
    <Box>
      <Box
        css={{
          maxWidth: 290,
          display: 'none',

          '@bp1': { display: 'block' },
        }}
      >
        <Text
          css={{
            fontFamily: '$body',
            color: '$white100',
            fontWeight: 600,
            letterSpacing: -0.2,
            fontSize: '$3',
            marginBottom: '$2',
          }}
        >
          Newsletters
        </Text>
        <Text
          css={{
            fontFamily: '$body',
            color: '$black60',
            fontWeight: 600,
            fontSize: '$1',
            lineHeight: 1.375,
          }}
        >
          Stay up to date on new releases, interviews, events, and updates from
          Foundation’s community.
        </Text>
      </Box>
      <Button
        color="black"
        size="large"
        shape="regular"
        css={{
          border: '1px solid $black80',
          marginTop: '$7',
          '@media (hover: hover)': {
            '&:hover': {
              backgroundColor: '$blue100',
              borderColor: '$blue100',
            },
          },
        }}
      >
        <Link href="/newsletters">
          <a
            style={{
              textDecoration: 'none',
              display: 'block',
              color: 'inherit',
            }}
          >
            Subscribe
          </a>
        </Link>
      </Button>
    </Box>
  );
}

function FooterLink(props: SiteLink): JSX.Element {
  const { external, children, href } = props;

  const style = {
    display: 'block',
    fontSize: 14,
    color: '$black60',
    fontFamily: '$body',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'color $2 $ease',
    '@media (hover: hover)': {
      '&:hover': {
        color: '$white100',
      },
    },
  };

  if (external) {
    return (
      <Box
        as="a"
        href={href}
        css={{ ...style }}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </Box>
    );
  }
  return (
    <Link href={href}>
      <Box as="a" css={{ ...style }}>
        {children}
      </Box>
    </Link>
  );
}

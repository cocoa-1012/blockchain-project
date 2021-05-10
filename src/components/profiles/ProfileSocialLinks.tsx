/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Link, Text, Grid } from 'theme-ui';
import { ReactNode } from 'react';

import Website from 'assets/images/social/website-icon.svg';
import DiscordIcon from 'assets/images/social/discord-icon.svg';
import Twitch from 'assets/images/social/twitch-icon.svg';
import YouTube from 'assets/images/social/youtube-icon.svg';
import Facebook from 'assets/images/social/facebook-icon.svg';
import TikTok from 'assets/images/social/tiktok-icon.svg';
import SnapchatIcon from 'assets/images/social/snapchat-icon.svg';

import Hoverable from 'components/Hoverable';

import { buildSocialLink, buildTikTokHandle, getUrlHost } from 'utils/urls';
import { getSocialHandle } from 'utils/strings';
import { isEmptyOrNil } from 'utils/helpers';

import { StyleObject } from 'types/styles';
import SocialLinkMap from 'types/SocialLink';

interface ProfileSocialLinksProps {
  socialLinks: SocialLinkMap;
}

export default function ProfileSocialLinks(
  props: ProfileSocialLinksProps
): JSX.Element {
  const { socialLinks } = props;

  return (
    <Grid gap={['s', null, 20]}>
      <SocialLink
        icon={<Website style={{ display: 'block' }} />}
        handle={socialLinks?.website?.handle}
        linkBuilderFn={buildSocialLink.website}
      >
        {getUrlHost(socialLinks?.website?.handle)}
      </SocialLink>

      <SocialLink
        icon={
          <DiscordIcon style={{ display: 'block' }} width={24} height={24} />
        }
        handle={socialLinks?.discord?.handle}
      >
        {socialLinks?.discord?.handle}
      </SocialLink>

      <SocialLink
        icon={<YouTube style={{ display: 'block' }} />}
        handle={socialLinks?.youtube?.handle}
        linkBuilderFn={buildSocialLink.youtube}
      >
        YouTube
      </SocialLink>

      <SocialLink
        icon={<Facebook style={{ display: 'block' }} />}
        handle={socialLinks?.facebook?.handle}
        linkBuilderFn={buildSocialLink.facebook}
      >
        {getSocialHandle(socialLinks?.facebook?.handle)}
      </SocialLink>

      <SocialLink
        icon={<Twitch style={{ display: 'block' }} />}
        handle={socialLinks?.twitch?.handle}
        linkBuilderFn={buildSocialLink.twitch}
      >
        {getSocialHandle(socialLinks?.twitch?.handle)}
      </SocialLink>

      <SocialLink
        icon={<TikTok style={{ display: 'block' }} />}
        handle={buildTikTokHandle(socialLinks?.tiktok?.handle)}
        linkBuilderFn={buildSocialLink.tiktok}
      >
        {getSocialHandle(buildTikTokHandle(socialLinks?.tiktok?.handle))}
      </SocialLink>

      <SocialLink
        icon={
          <SnapchatIcon style={{ display: 'block' }} width={24} height={23} />
        }
        handle={socialLinks?.snapchat?.handle}
        linkBuilderFn={buildSocialLink.snapchat}
      >
        {getSocialHandle(socialLinks?.snapchat?.handle)}
      </SocialLink>
    </Grid>
  );
}

interface SocialLinkIconProps {
  children: ReactNode;
}

function SocialLinkIcon(props: SocialLinkIconProps): JSX.Element {
  const { children } = props;
  return <Box sx={{ marginRight: 's' }}>{children}</Box>;
}

interface SocialLinkHandleProps {
  children: ReactNode;
}

function SocialLinkHandle(props: SocialLinkHandleProps): JSX.Element {
  const { children } = props;
  return (
    <Text variant="h.xs" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {children}
    </Text>
  );
}

interface SocialLinkProps {
  handle: string;
  children: ReactNode;
  icon: ReactNode;
  linkBuilderFn?: any;
}

function SocialLink(props: SocialLinkProps): JSX.Element {
  const { handle, children, linkBuilderFn, icon } = props;

  const sx = getStyles();

  const noHandle = isEmptyOrNil(handle);

  if (noHandle) {
    return null;
  }

  if (!linkBuilderFn) {
    return (
      <Hoverable>
        <Box sx={sx.link}>
          <SocialLinkIcon>{icon}</SocialLinkIcon>
          <SocialLinkHandle>{children}</SocialLinkHandle>
        </Box>
      </Hoverable>
    );
  }

  return (
    <Hoverable>
      <Link
        href={linkBuilderFn(handle)}
        sx={sx.link}
        target="_blank"
        rel="noreferrer"
      >
        <SocialLinkIcon>{icon}</SocialLinkIcon>
        <SocialLinkHandle>{children}</SocialLinkHandle>
      </Link>
    </Hoverable>
  );
}

const getStyles = (): StyleObject => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'black.100',
    fontFamily: 'body',
    fontSize: ['s', null, 'xs'],
  },
});

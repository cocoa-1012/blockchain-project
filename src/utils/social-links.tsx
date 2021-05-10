import React from 'react';
import WebsiteIcon from 'assets/images/social/website-icon.svg';
import InstagramIcon from 'assets/images/social/instagram-icon.svg';
import TwitterIcon from 'assets/images/social/twitter-icon.svg';
import YouTubeIcon from 'assets/images/social/youtube-icon.svg';
import FacebookIcon from 'assets/images/social/facebook-icon.svg';
import TwitchIcon from 'assets/images/social/twitch-icon.svg';
import TikTokIcon from 'assets/images/social/tiktok-icon.svg';
import DiscordIcon from 'assets/images/social/discord-icon.svg';
import SnapChatIcon from 'assets/images/social/snapchat-icon.svg';

import { SocialLinkType } from 'types/SocialLink';

export const getInitialSocialLinks = (socialLinks) =>
  socialLinks.reduce(
    (obj, item) => ({
      ...obj,
      [item.type]: {
        platform: item.type,
        handle: '',
      },
    }),
    {}
  );

// TODO: rewrite this fn
export const mergeSocialLinks = (socialLinks, userProfileLinks) => {
  const initialLinks = getInitialSocialLinks(socialLinks);
  const updates = {};

  // Strip __typename and update initial links with DB data
  if (userProfileLinks) {
    Object.keys(userProfileLinks).forEach((platform) => {
      if (platform != '__typename') {
        const link = userProfileLinks[platform];

        if (link) {
          const _updates = {};
          Object.keys(link).forEach((field) => {
            if (field != '__typename') {
              _updates[field] = link[field];
            }
          });
          updates[platform] = _updates;
        }
      }
    });
  }
  return { ...initialLinks, ...updates };
};

const svgStyle = { display: 'block' };

export const socialLinks = [
  {
    title: 'Website',
    type: SocialLinkType.website,
    placeholder: 'Website URL',
    urlPrefix: 'https://',
    icon: <WebsiteIcon style={svgStyle} />,
  },
  {
    title: 'Instagram',
    type: SocialLinkType.instagram,
    placeholder: 'Instagram Username',
    urlPrefix: 'instagram.com/',
    icon: <InstagramIcon style={svgStyle} />,
  },
  {
    title: 'Twitter',
    type: SocialLinkType.twitter,
    placeholder: 'Twitter Username',
    urlPrefix: 'twitter.com/',
    icon: <TwitterIcon style={svgStyle} />,
  },
  {
    title: 'Discord',
    type: SocialLinkType.discord,
    urlPrefix: '',
    placeholder: 'Include #Code',
    icon: <DiscordIcon style={svgStyle} width={24} height={24} />,
  },
  {
    title: 'YouTube',
    type: SocialLinkType.youtube,
    urlPrefix: '',
    placeholder: 'Channel URL',
    icon: <YouTubeIcon style={svgStyle} />,
  },
  {
    title: 'Facebook',
    type: SocialLinkType.facebook,
    urlPrefix: 'facebook.com/',
    placeholder: 'Facebook Username',
    icon: <FacebookIcon style={svgStyle} />,
  },
  {
    title: 'Twitch',
    type: SocialLinkType.twitch,
    urlPrefix: 'twitch.tv/',
    placeholder: 'Twitch Username',
    icon: <TwitchIcon style={svgStyle} />,
  },
  {
    title: 'TikTok',
    type: SocialLinkType.tiktok,
    urlPrefix: 'tiktok.com/',
    placeholder: 'TikTok Username',
    icon: <TikTokIcon style={svgStyle} />,
  },
  {
    title: 'Snapchat',
    type: SocialLinkType.snapchat,
    urlPrefix: '',
    placeholder: 'Snapchat Username',
    icon: <SnapChatIcon style={svgStyle} width={24} height={23} />,
  },
];

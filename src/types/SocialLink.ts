export enum SocialLinkType {
  twitter = 'twitter',
  instagram = 'instagram',
  website = 'website',
  discord = 'discord',
  youtube = 'youtube',
  facebook = 'facebook',
  twitch = 'twitch',
  tiktok = 'tiktok',
  snapchat = 'snapchat',
}

type SocialLinkMap = {
  [key in SocialLinkType]: {
    platform: SocialLinkType;
    handle: string;
  };
};

export type SocialLinkVerifiedMap = {
  [SocialLinkType.twitter]?: {
    platform: SocialLinkType.twitter;
    handle: string;
  };
  [SocialLinkType.instagram]?: {
    platform: SocialLinkType.instagram;
    handle: string;
  };
};

export default SocialLinkMap;

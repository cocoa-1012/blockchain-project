import { compose, propOr, find, prop, when } from 'ramda';

import SocialVerification, {
  SocialVerifService,
} from 'types/SocialVerification';

import { notEmptyOrNil } from './helpers';

interface SocialVerificationData {
  socialVerifications: SocialVerification[];
}

const appendHandle = when(notEmptyOrNil, (handle) => `@${handle}`);

export const getTwitterUsername = compose<
  SocialVerificationData,
  SocialVerification[],
  SocialVerification,
  string,
  string
>(
  appendHandle,
  prop('username'),
  find(
    (verif: SocialVerification) => verif.service === SocialVerifService.TWITTER
  ),
  propOr([], 'socialVerifications')
);

const createShareURL = (path: string): string => {
  return new URL(path, 'https://foundation.app').href;
};

interface BuildClaimTweetArgs {
  artworkName: string;
  creatorName: string;
  usernameOrAddress: string;
  twitterUsername: string;
}

// tweet at the end of the claim flow
export const buildClaimTweet = ({
  artworkName,
  creatorName,
  usernameOrAddress,
  twitterUsername,
}: BuildClaimTweetArgs): string => {
  return `I just added ${artworkName} by ${
    twitterUsername || creatorName
  } to my collection on @withFND! š

${createShareURL(usernameOrAddress)}`;
};

interface BuildArtworkTweetArgs {
  creatorName: string;
  artworkPath: string;
  twitterUsername: string;
}

// tweet for sharing an artwork from an artwork page
export const buildArtworkTweet = ({
  creatorName,
  artworkPath,
  twitterUsername,
}: BuildArtworkTweetArgs): string => {
  return `Check out this artwork by ${
    twitterUsername || creatorName
  } on @withFND! š

${createShareURL(artworkPath)}`;
};

interface BuildVerifyTweetArgs {
  creatorName: string;
  creatorAddress: string;
  profilePath: string;
}

export const buildVerifyTweet = ({
  creatorName,
  creatorAddress,
  profilePath,
}: BuildVerifyTweetArgs): string => {
  return `Iām on @withFND š

${creatorAddress}

${createShareURL(profilePath)}`;
};

interface BuildListTweetArgs {
  artworkName: string;
  artworkPath: string;
}

// tweet at the end of the list flow
export const buildListTweet = ({
  artworkName,
  artworkPath,
}: BuildListTweetArgs): string => {
  return `I just listed ā${artworkName}ā for sale on @withFND! š

${createShareURL(artworkPath)}`;
};

interface BuildSecondaryListTweetArgs {
  artworkName: string;
  artworkPath: string;
  twitterUsername: string;
}

// tweet at the end of the secondary list flow
export const buildSecondaryListTweet = ({
  artworkName,
  artworkPath,
  twitterUsername,
}: BuildSecondaryListTweetArgs): string => {
  if (twitterUsername) {
    return `I just listed ā${artworkName}ā by ${twitterUsername} for sale on @withFND! š

${createShareURL(artworkPath)}`;
  }

  return `I just listed ā${artworkName}ā for sale on @withFND! š

${createShareURL(artworkPath)}`;
};

interface BuildUpvoteTweetArgs {
  usernameOrAddress: string;
}

export const buildUpvoteTweet = ({
  usernameOrAddress,
}: BuildUpvoteTweetArgs): string => {
  return `Community Upvote š @withFND

Iām in the running to join Foundation as a creator and start minting NFTs!

Vote ā ${createShareURL(usernameOrAddress)}`;
};

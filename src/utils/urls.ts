/* eslint-disable max-lines */
import qs from 'query-string';

import { URL_REGEX } from 'schemas/generic';

import {
  startsWith,
  anyPass,
  test,
  unless,
  when,
  is,
  ifElse,
  curry,
  allPass,
  always,
  compose,
} from 'ramda';

import { isProd, notEmptyOrNil } from 'utils/helpers';

import { getNFT721Address } from 'lib/addresses';
import { OG_IMAGE } from './constants/meta';
import { getInstagramHandle, getSocialHandle } from './strings';

export const urlWithParams = (url: string, query: any): string => {
  return when(
    notEmptyOrNil,
    (url) => {
      // Check if url already contains a query string
      // Cant use new URL api as Contentful sends no protocol
      const qsPattern = new RegExp(/\?.+=.*/g);
      if (qsPattern.test(url)) {
        return url;
      }
      return `${url}?${qs.stringify(query)}`;
    },
    url
  );
};

export const buildAvatarUrl = (imageUrl: string): string => {
  return when(
    notEmptyOrNil,
    (imageUrl) =>
      urlWithParams(imageUrl, {
        q: 90,
        w: 200,
        h: 200,
        fit: 'fill',
      }),
    imageUrl
  );
};

export const withHttps = when(
  is(String),
  ifElse(
    startsWith('http'),
    (url) => url,
    (url) => `https:${url}`
  )
);

export const getOgImage = ifElse(notEmptyOrNil, withHttps, always(OG_IMAGE));

export const absoluteUrl = (path: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && isProd()
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';

  if (!path || path === '/') {
    return baseUrl;
  }

  return baseUrl + path;
};

export function getFileName(fileUrl: string): string {
  return when(
    notEmptyOrNil,
    (fileUrl) => fileUrl.split('/').pop().split('#')[0].split('?')[0],
    fileUrl
  );
}

export function getFileExtension(fileUrl: string): string {
  return when(
    notEmptyOrNil,
    (fileUrl) => {
      const filename = getFileName(fileUrl);
      return filename.split('.').pop();
    },
    fileUrl
  );
}
const appendHandle = curry((url: string, handle: string): string => {
  return when(
    notEmptyOrNil,
    (handle) => (handle.startsWith('http') ? handle : `${url}${handle}`),
    handle
  );
});

export const buildSocialLink = {
  website: appendHandle('http://'),
  instagram: compose(
    appendHandle('https://instagram.com/'),
    getInstagramHandle
  ),
  twitter: compose(appendHandle('https://twitter.com/'), getSocialHandle),
  // TODO: Handle YouTube user accounts (non-channel ones) better
  youtube: appendHandle('https://youtube.com/channel/'),
  facebook: appendHandle('https://facebook.com/'),
  twitch: appendHandle('https://twitch.tv/'),
  tiktok: appendHandle('https://www.tiktok.com/'),
  snapchat: appendHandle('https://snapchat.com/add/'),
};

export function getUrlHost(url: string): string {
  return when(
    notEmptyOrNil,
    (url) => {
      try {
        const urlObject = new URL(url);
        return urlObject.hostname;
      } catch (error) {
        return url;
      }
    },
    url
  );
}

// is a valid url
const isValidUrl = test(URL_REGEX);
// starts with a @ symbol
const hasAtSymbol = startsWith('@');

export const buildTikTokHandle = when(
  allPass([is(String), notEmptyOrNil]),
  unless(
    // if the url starts with an @ symbol
    // or is a URL match return false
    anyPass([hasAtSymbol, isValidUrl]),
    // otherwise append @ symbol if true
    (handle) => `@${handle}`
  )
);

export const buildOpenSeaUrl = (tokenId: string): string =>
  `https://opensea.io/assets/${getNFT721Address()}/${tokenId}`;

export const VALID_URL_REGEX = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})*$/;

export const isValidURL = test(VALID_URL_REGEX);

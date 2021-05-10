import * as Yup from 'yup';

import { TWITTER_URL_MAX_CHARS } from 'lib/constants';

export const URL_REGEX = /^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{2,24}/g;
export const TWITTER_REGEX = /(twitter)/g;
export const TWEET_REGEX = /(status)/g;

export const TwitterSchema = Yup.object().shape({
  // TODO: Validate that it's a URL and starts with https, etc.
  tweetURL: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .max(TWITTER_URL_MAX_CHARS, 'Can’t be more than 200 characters')
    .matches(URL_REGEX, 'This is not a valid URL')
    .matches(TWITTER_REGEX, 'This is not a Twitter URL')
    .matches(TWEET_REGEX, 'This is not a valid tweet URL')
    .nullable(),
});

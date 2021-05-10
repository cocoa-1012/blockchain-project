/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { Box, jsx, Text, Button, Flex, Grid } from 'theme-ui';
import { useMutation } from 'react-query';

import InternalLink from 'components/links/InternalLink';
import SpinnerStroked from 'components/SpinnerStroked';

import { getUsernameOrAddress } from 'utils/helpers';
import { buildUpvoteTweet } from 'utils/twitter-templates';

import { setWaitlistLeave } from 'queries/hasura/waitlist';

import TwitterIcon from 'assets/images/social/twitter-icon.svg';

import { positionRelative, textAlignRight } from 'types/styles';
import Account from 'types/Account';
import SocialVerification from 'types/SocialVerification';

import useResetWaitlistCaches from 'hooks/queries/hasura/use-reset-waitlist-caches';

export interface RallyYourAudienceProps {
  currentUser: Account;
  totalUserCount: number;
  token: string;
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
}

export default function RallyYourAudience(
  props: RallyYourAudienceProps
): JSX.Element {
  const { currentUser, token } = props;

  const invalidateQueries = useResetWaitlistCaches();

  const {
    mutate: leaveWaitlist,
    isLoading: leaveWaitlistLoading,
  } = useMutation(() => setWaitlistLeave(token), {
    onSuccess: invalidateQueries,
  });

  const usernameOrAddress = getUsernameOrAddress(currentUser);

  return (
    <Box>
      <Box sx={sx.activeUserInfo}>
        <Box sx={{ textAlign: 'right' }}>
          <Grid gap="m">
            <Text variant="h.s">Rally your audience for support!</Text>
            <Text
              variant="body.body"
              sx={{ color: 'black.60', maxWidth: 270, ml: 'auto' }}
            >
              Share your profile to get upvotes and move up in the Community
              Upvote
            </Text>
          </Grid>

          <Flex
            sx={{
              justifyContent: 'flex-end',
              flex: 1,
              paddingTop: 'l',
              paddingBottom: 'xl',
            }}
          >
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURI(
                buildUpvoteTweet({ usernameOrAddress })
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'block' }}
            >
              <Button type="button" sx={{ paddingRight: '36px !important' }}>
                <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <TwitterIcon
                    width={24}
                    height={24}
                    sx={{ display: 'block' }}
                  />
                  <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
                    Share to Twitter
                  </Text>
                </Flex>
              </Button>
            </a>
          </Flex>
          <Box
            sx={{ display: 'flex' }}
            style={{ pointerEvents: leaveWaitlistLoading ? 'none' : 'all' }}
          >
            <InternalLink sx={sx.leaveButton} onClick={leaveWaitlist}>
              {leaveWaitlistLoading && (
                <Flex sx={{ marginRight: 'xs' }}>
                  <SpinnerStroked size={18} />
                </Flex>
              )}
              Remove your profile from Community Upvote
            </InternalLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const sx = {
  activeUserInfo: {
    px: ['s', null, 'xl'],
    py: 'xl',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  leaderboardRow: {
    display: ['block', null, 'flex'],
    alignItems: 'center',
    px: ['s', null, 'xl'],
    py: 'm',
    borderTop: '1px solid',
    borderTopColor: 'black.10',
  },
  userInfoWrapper: {
    position: positionRelative,
    display: 'flex',
    alignItems: 'center',
  },
  avatar: { mr: 's' },
  name: {
    fontWeight: 600,
  },
  username: {
    fontSize: 'xs',
    fontWeight: 600,
  },
  socialLink: {
    ml: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  leaveButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: textAlignRight,
    ml: 'auto',
  },
};

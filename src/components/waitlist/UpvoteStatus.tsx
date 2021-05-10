/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Grid, Text, ThemeUIStyleObject } from 'theme-ui';

import UpvoteTips from 'components/waitlist/UpvoteTips';
import RallyYourAudience from './RallyYourAudience';

import { UpvoteProps } from './types';
import UplistVoteCount from './UpvoteListCount';

export default function UpvoteStatus(props: UpvoteProps): JSX.Element {
  const {
    token,
    twitterSocialVerification,
    instagramSocialVerification,
    currentUser,
    totalUserCount,
  } = props;

  const sx = getStyles();

  return (
    <Grid sx={sx.container}>
      <Grid gap="xl">
        <Grid gap="m" sx={{ textAlign: 'center' }}>
          <Heading variant="h.xl">You’re in the Community Upvote!</Heading>
          <Text variant="body.body" sx={{ maxWidth: 400, marginX: 'auto' }}>
            Thank you for joining the Community Upvote. You will receive an
            email once you’ve been accepted.
          </Text>
        </Grid>

        <Grid sx={sx.grid}>
          <UpvoteTips
            twitterSocialVerification={twitterSocialVerification}
            instagramSocialVerification={instagramSocialVerification}
            currentUser={currentUser}
            token={token}
            totalUserCount={totalUserCount}
          />

          <RallyYourAudience
            twitterSocialVerification={twitterSocialVerification}
            instagramSocialVerification={instagramSocialVerification}
            currentUser={currentUser}
            token={token}
            totalUserCount={totalUserCount}
          />
        </Grid>
      </Grid>

      <UplistVoteCount totalUserCount={totalUserCount} />
    </Grid>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    maxWidth: 1000,
    width: '100%',
    marginX: 'auto',
    paddingY: 'xxl',
    gap: 'l',
  };
  const grid: ThemeUIStyleObject = {
    gridTemplateColumns: 'repeat(2, 1fr)',
    backgroundColor: 'white.100',
    borderRadius: 10,
    boxShadow: 's',
  };
  return { container, grid };
};

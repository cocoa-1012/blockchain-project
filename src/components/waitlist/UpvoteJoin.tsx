/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Grid, Text, ThemeUIStyleObject } from 'theme-ui';

import JoinWaitlist from 'components/waitlist/JoinWaitlist';
import UplistVoteCount from './UpvoteListCount';

import { UpvoteProps } from './types';

export default function UpvoteJoin(props: UpvoteProps): JSX.Element {
  const {
    token,
    publicAddress,
    isVerified,
    onWaitlist,
    isLoading,
    isApprovedCreator,
    twitterSocialVerification,
    instagramSocialVerification,
    currentUser,
    totalUserCount,
  } = props;

  const sx = getStyles();
  return (
    <Grid gap="xl">
      <Grid gap="m" sx={{ maxWidth: 720, justifyContent: 'center' }}>
        <Heading variant="h.xl" sx={{ textAlign: 'center' }}>
          Join the Community Upvote to access creator tools.
        </Heading>

        {/* TODO: Center this text */}
        <Grid sx={sx.grid}>
          <Text variant="stnd.body" sx={sx.text}>
            With the Community Upvote, artists are encouraged to support other
            artists and to set the stage for a model of community-led curation
            that puts power in the hands of creators.
          </Text>
          <Text variant="stnd.body" sx={sx.text}>
            In the new creative economy, we all rise up together.
          </Text>
          <JoinWaitlist
            token={token}
            isLoggedIn={Boolean(publicAddress)}
            isVerified={isVerified}
            isOnWaitlist={onWaitlist}
            isLoading={isLoading}
            isApprovedCreator={isApprovedCreator}
          />
        </Grid>
      </Grid>

      <UplistVoteCount totalUserCount={totalUserCount} />
    </Grid>
  );
}

const getStyles = () => {
  const grid: ThemeUIStyleObject = {
    flexDirection: 'column',
    maxWidth: '32em',
    justifyContent: 'center',
    gap: 'l',
    marginX: 'auto',
  };

  const text: ThemeUIStyleObject = { lineHeight: 1.6, textAlign: 'center' };

  return { grid, text };
};

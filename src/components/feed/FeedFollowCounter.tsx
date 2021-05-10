/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import {
  jsx,
  ThemeUIStyleObject,
  Box,
  Heading,
  Text,
  Flex,
  Button,
} from 'theme-ui';

import Body from 'components/Body';
import Link from 'components/links/Link';

import { MIN_FOLLOWS_COUNT } from 'lib/constants';
import { transitions } from 'utils/themes/main/theme';

interface FollowCounterProps {
  followingCount: number;
}

export default function FeedFollowCounter(
  props: FollowCounterProps
): JSX.Element {
  const { followingCount } = props;

  const needsMoreFollows = followingCount < MIN_FOLLOWS_COUNT;

  const percentProgress = (followingCount / MIN_FOLLOWS_COUNT) * 100;

  const sx = getStyles();

  return (
    <Box sx={sx.sticky}>
      <Body sx={sx.grid}>
        <Flex sx={{ alignItems: 'center' }}>
          <Heading variant="h.s" sx={{ marginRight: 'l' }}>
            {followingCount}/{MIN_FOLLOWS_COUNT}
          </Heading>
          <Text
            variant="h.body"
            sx={{ lineHeight: 1.3, color: 'black.50', maxWidth: 180 }}
          >
            Follow at least {MIN_FOLLOWS_COUNT} creators to continue
          </Text>
        </Flex>
        <Flex sx={sx.progress}>
          <Box sx={sx.progressTrack} style={{ width: `${percentProgress}%` }} />
        </Flex>

        <Box
          sx={{
            marginLeft: 'auto',
            pointerEvents: needsMoreFollows ? 'none' : 'all',
          }}
        >
          <Link href="/feed">
            <a sx={{ textDecoration: 'none', display: 'block' }}>
              <Button sx={{ minWidth: 180 }} disabled={needsMoreFollows}>
                Continue
              </Button>
            </a>
          </Link>
        </Box>
      </Body>
    </Box>
  );
}

const getStyles = () => {
  const sticky: ThemeUIStyleObject = {
    position: 'sticky',
    bottom: 0,
    left: 0,
    paddingY: 'm',
    backgroundColor: 'white.100',
    boxShadow: '0px -10px 20px rgba(0, 0, 0, 0.1)',
  };

  const grid: ThemeUIStyleObject = {
    display: 'grid',
    gridTemplateColumns: '1fr 250px 1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const progress: ThemeUIStyleObject = {
    width: 250,
    height: 5,
    backgroundColor: 'black.5',
    borderRadius: 4,
  };

  const progressTrack: ThemeUIStyleObject = {
    width: 250,
    height: 5,
    backgroundColor: 'black.100',
    borderRadius: 4,
    transition: transitions.smooth.fast,
  };

  return { sticky, grid, progress, progressTrack };
};

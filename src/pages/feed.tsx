/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject, Box, Heading } from 'theme-ui';
import { GetStaticPropsResult } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { is } from 'ramda';
import { Global } from '@emotion/react';

import Page from 'components/Page';
import Body from 'components/Body';
import FeedFeaturedCreators from 'components/feed/FeedFeaturedCreators';
import FeedArtworks from 'components/feed/FeedArtworks';
import FeedFollowCounter from 'components/feed/FeedFollowCounter';
import LoadingPage from 'components/LoadingPage';

import { theme } from 'utils/themes/main/theme';
import { sortCreatorsByUsernames } from 'utils/creator';
import { maybeGetAddress } from 'utils/users';
import getChainId from 'lib/chainId';

import { getFeaturedContentIds } from 'queries/server/content';
import { getHasuraUsersByUsernames } from 'queries/hasura/users';

import useAuthToken from 'hooks/queries/use-auth-token';
import useFollowCounts from 'hooks/queries/hasura/use-follow-counts';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import Account from 'types/Account';
import { MIN_FOLLOWS_COUNT } from 'lib/constants';

interface FeedPageProps {
  featuredCreators: Account[];
  featuredCreatorUsernames: string[];
}

export default function Feed(props: FeedPageProps): JSX.Element {
  const { featuredCreators } = props;

  const { user } = useAuthToken();

  const router = useRouter();

  const publicAddress = user?.publicAddress;

  const {
    data: followCountData,
    isLoading: followCountLoading,
  } = useFollowCounts({
    publicKey: publicAddress,
  });

  const { data: currentUserData } = useUserByPublicKey({
    publicKey: publicAddress,
    refetchOnWindowFocus: false,
  });

  const followingCount = followCountData?.followingCount?.aggregate?.count;

  const creatorIds = featuredCreators.map((creator) =>
    maybeGetAddress(creator.publicKey)
  );

  const isLoading = !followCountData || followCountLoading;

  const isNumber = is(Number);

  const needsMoreFollows = Boolean(
    isNumber(followingCount) && followingCount < MIN_FOLLOWS_COUNT
  );

  useEffect(
    () => {
      if (needsMoreFollows) {
        router.push('/feed?follow=true', '/feed?follow=true', {
          shallow: true,
          scroll: false,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [needsMoreFollows]
  );

  const inFollowMode = Boolean(router.query.follow);

  return (
    <Page
      title="Feed"
      footerStyle={{ display: inFollowMode ? 'none' : 'block' }}
    >
      <Global styles={{ body: { backgroundColor: theme.colors.black[5] } }} />
      <RenderFeed
        creatorIds={creatorIds}
        followingCount={followingCount}
        publicAddress={publicAddress}
        isLoading={isLoading}
        inFollowMode={inFollowMode}
        currentUser={currentUserData?.user}
      />
    </Page>
  );
}

interface RenderFeedProps {
  isLoading: boolean;
  followingCount: number;
  creatorIds: string[];
  publicAddress: string;
  inFollowMode: boolean;
  currentUser?: Account;
}

function RenderFeed(props: RenderFeedProps): JSX.Element {
  const {
    isLoading,
    followingCount,
    creatorIds,
    publicAddress,
    inFollowMode,
    currentUser,
  } = props;

  const sx = getStyles();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (inFollowMode) {
    return (
      <>
        <Body sx={{ ...sx.body, display: isLoading ? 'none' : 'flex' }}>
          <Box sx={sx.intro}>
            <Heading variant="h.m" sx={sx.heading}>
              Follow at least five creators to build your feed…
            </Heading>
          </Box>

          <FeedFeaturedCreators
            creatorIds={creatorIds}
            publicAddress={publicAddress}
          />
        </Body>
        <FeedFollowCounter followingCount={followingCount} />
      </>
    );
  }

  return (
    <Body sx={sx.feedBody}>
      <FeedArtworks publicAddress={publicAddress} currentUser={currentUser} />
    </Body>
  );
}

const getStyles = () => {
  const body: ThemeUIStyleObject = {
    flex: 1,
    flexDirection: 'column',
    paddingTop: ['xxl', null, 'xxxl', 'xxxxl'],
  };
  const feedBody: ThemeUIStyleObject = {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  };
  const intro: ThemeUIStyleObject = {
    paddingBottom: ['xxl', null, 'xxxl', 'xxxxl'],
  };
  const heading: ThemeUIStyleObject = {
    maxWidth: 460,
    marginX: 'auto',
    textAlign: 'center',
  };
  return { body, feedBody, intro, heading };
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<FeedPageProps>
> {
  const chainId = getChainId();

  const { featuredCreatorUsernames } = await getFeaturedContentIds({
    preview: false,
    chainId,
  });

  const { users } = await getHasuraUsersByUsernames(featuredCreatorUsernames);

  const sortedCreators = sortCreatorsByUsernames(
    featuredCreatorUsernames,
    users
  );

  return {
    props: {
      featuredCreators: sortedCreators,
      featuredCreatorUsernames,
    },
    revalidate: 60,
  };
}

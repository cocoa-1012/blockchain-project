/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { length } from 'ramda';
import { ReactNode } from 'react';

import CreatorCard from 'components/cards/creator/CreatorCard';
import CardGrid from 'components/CardGrid';
import CreatorCardFollowState from 'components/cards/creator/CreatorCardFollowState';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import CreatorSkeletonArray from './CreatorSkeletonArray';
import InfiniteScrollButton from './InfiniteScrollButton';

import { AccountFeed } from 'types/Account';
import { getUsers, maybeGetAddress } from 'utils/users';

import useFollowsByUserPublicKeys from 'hooks/queries/hasura/use-follows-by-user-public-keys';

interface CreatorResultsProps {
  creators: AccountFeed[];
  handleNextPage: () => void;
  noMoreResultsComponent?: ReactNode;
  noMoreResults: boolean;
  isLoading: boolean;
  enableHeader: boolean;
  onFollowUpdate: () => void;
  isFetching: boolean;
  publicAddress: string;
  hideBiosOnMobile?: boolean;
}

export default function CreatorResults(
  props: CreatorResultsProps
): JSX.Element {
  const {
    creators,
    handleNextPage,
    noMoreResultsComponent,
    noMoreResults,
    isLoading,
    enableHeader,
    onFollowUpdate,
    isFetching,
    publicAddress,
    hideBiosOnMobile,
  } = props;

  const creatorIds = creators.map((user) => maybeGetAddress(user.publicKey));

  const { data: userFollowsData } = useFollowsByUserPublicKeys({
    creatorIds,
    publicKey: publicAddress,
  });

  const userFollows: AccountFeed[] = getUsers(userFollowsData);

  const creatorFollowsCount = length(
    userFollows.flatMap((creator) => creator.follows)
  );

  if (isLoading) {
    return (
      <Box>
        {enableHeader && (
          <FeaturedSectionHeading
            linkHref="/creators"
            linkText="View all creators"
            sx={{ paddingTop: [0, 0, 0] }}
          >
            Featured creators
          </FeaturedSectionHeading>
        )}

        <CardGrid>
          <CreatorSkeletonArray />
        </CardGrid>
      </Box>
    );
  }

  return (
    <Box>
      {enableHeader && (
        <FeaturedSectionHeading
          linkHref="/creators"
          linkText="View all creators"
          sx={{ paddingTop: [0, 0, 0] }}
        >
          Featured creators
        </FeaturedSectionHeading>
      )}

      <CardGrid>
        {creators.map((creator) => {
          const followState = userFollows.find(
            (user) => user.publicKey === creator.publicKey
          );
          return (
            <CreatorCard
              creator={creator}
              key={creator.publicKey}
              hideBiosOnMobile={hideBiosOnMobile}
              meta={
                <CreatorCardFollowState
                  publicKey={creator.publicKey}
                  followState={followState || creator}
                  followsCount={creatorFollowsCount}
                  onCompleted={onFollowUpdate}
                />
              }
            />
          );
        })}
      </CardGrid>

      <InfiniteScrollButton
        handleNextPage={handleNextPage}
        isFetching={isFetching}
        hasNextPage={!noMoreResults}
      />
    </Box>
  );
}

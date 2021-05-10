/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, ThemeUIStyleObject, Box } from 'theme-ui';
import { any, compose, isNil, map, reject, flatten, uniq, path } from 'ramda';

import InfiniteScrollButton from './InfiniteScrollButton';
import MasonryGrid from 'components/MasonryGrid';

import Artwork, { ArtworkWithEvent } from 'types/Artwork';
import Account from 'types/Account';
import Bid from 'types/Bid';

import useFollowedArtworkEvents from 'hooks/queries/hasura/use-followed-artwork-events';
import useUsersByPublicKeys from 'hooks/queries/hasura/use-users-by-public-keys';
import ArtworkCard from 'components/cards/artworkV2/ArtworkCard';
import { areKeysEqual } from 'utils/users';
import useApproval from 'hooks/queries/subgraph/use-approval';
import { notEmptyOrNil } from 'utils/helpers';

interface FeedArtworksProps {
  publicAddress?: string;
  currentUser?: Account;
}

interface MasonryGridRenderProps {
  artwork: ArtworkWithEvent;
  publicAddress?: string;
}

export default function FeedArtworks(props: FeedArtworksProps): JSX.Element {
  const { publicAddress, currentUser } = props;

  const sx = getStyles();

  // Get all events from the feed dataset
  const {
    data: followedArtworkEventsData,
    isLoading: isFollowedArtworkEventsLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useFollowedArtworkEvents({ publicKey: publicAddress });

  // Flatten response to a single array
  const followedArtworkEvents = flatten(followedArtworkEventsData?.pages ?? []);

  // Take only the most recent artwork event from the feed, discard the rest
  const mostRecentFollowedArtworkEvents = followedArtworkEvents.reduce<
    Artwork[]
  >((acc, curr) => {
    if (acc.findIndex((artwork) => artwork.tokenId === curr.tokenId) > -1) {
      return acc;
    }

    return [...acc, curr];
  }, []);

  const biddersPublicKeys = compose<
    Artwork[],
    Bid[][],
    Bid[][],
    Bid[],
    string[],
    string[]
  >(
    uniq,
    map(path(['bidder', 'id'])),
    flatten,
    reject(isNil),
    map((e: Artwork) => e.mostRecentActiveAuction?.bids)
  )(mostRecentFollowedArtworkEvents);

  const { data: relatedUsersData, isLoading: isRelatedUsersLoading } =
    useUsersByPublicKeys({
      publicKeys: biddersPublicKeys,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // Keep previous data so we dont get a flash of loading when fetching new pages
      keepPreviousData: true,
    });

  const { data: approvalData, isLoading: approvalDataIsLoading } = useApproval({
    publicKey: currentUser?.publicKey,
  });

  const hasApprovedMarketContract = notEmptyOrNil(
    approvalData?.account?.nftAccountApprovals
  );

  const isAnyLoading = any(Boolean, [
    isRelatedUsersLoading,
    isFollowedArtworkEventsLoading,
    approvalDataIsLoading,
  ]);

  return (
    <Box>
      <Box sx={sx.container}>
        <MasonryGrid
          isLoading={isAnyLoading}
          artworks={mostRecentFollowedArtworkEvents}
          onReachedEnd={fetchNextPage}
        >
          {(props: MasonryGridRenderProps) => (
            <ArtworkCard
              artwork={props.artwork}
              event={props.artwork.event}
              creator={props.artwork?.creator}
              isOwner={areKeysEqual([
                publicAddress,
                props.artwork?.ownedOrListedBy?.id,
              ])}
              currentUser={currentUser}
              mostRecentActiveAuction={props.artwork?.mostRecentActiveAuction}
              users={relatedUsersData?.users}
              hasApprovedMarketContract={hasApprovedMarketContract}
              sx={{ marginBottom: 'm' }}
            />
          )}
        </MasonryGrid>
      </Box>

      <InfiniteScrollButton
        handleNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
      />
    </Box>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    paddingTop: ['xl', null, 'xxl'],
    gap: ['s', 'm', 'xxl'],
  };

  return { container };
};

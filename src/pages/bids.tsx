/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Heading } from 'theme-ui';
import { map, path } from 'ramda';
import { useEffect } from 'react';
import { Global, css } from '@emotion/react';
import { colors } from 'utils/themes/main/theme';

import Page from 'components/Page';
import Body from 'components/Body';
import {
  PrimaryBidsTable,
  SecondaryBidsTable,
} from 'components/bids/BidsTable';
import BidsEmptyState from 'components/bids/BidsEmptyState';
import LoadingPage from 'components/LoadingPage';

import useAuthToken from 'hooks/queries/use-auth-token';
import useAccountBids from 'hooks/queries/subgraph/use-account-bids';
import { useBidActivityArtworks } from 'hooks/queries/server/use-batch-server-artworks';

import { getBidsForActivity, sortBidsByEndingDateDesc } from 'utils/bids/bids';
import { notEmptyOrNil } from 'utils/helpers';

import { PageTypes } from 'types/page';
import Bid from 'types/Bid';

const getTokenIds = map<Bid, string>(path(['nft', 'tokenId']));

export default function Bids(): JSX.Element {
  const { user, isLoading: userLoading } = useAuthToken();
  const publicAddress = user?.publicAddress;

  const sx = getStyles();

  const {
    data: bidsData,
    loading: bidsLoading,
    refetch: refetchBids,
  } = useAccountBids(publicAddress);

  const placedBidsRaw = bidsData?.placedBids ?? [];
  const receivedBidsRaw = bidsData?.receivedBids?.nftMarketAuctions ?? [];

  const placedBids = getBidsForActivity(placedBidsRaw);
  const receivedBids = sortBidsByEndingDateDesc(receivedBidsRaw);

  const tokenIds = getTokenIds([...placedBids, ...receivedBids]);

  const {
    data: artworksData,
    loading: artworksLoading,
    refetch: refetchArtworks,
  } = useBidActivityArtworks({
    tokenIds,
    excludeHidden: false,
  });

  // refetch artworks whenever bids change
  useEffect(() => {
    refetchArtworks();
  }, [bidsData, refetchArtworks]);

  // refetch bid data on mount
  useEffect(() => {
    if (publicAddress) {
      refetchBids();
    }
  }, [publicAddress, refetchBids]);

  const artworks = artworksData?.artworks ?? [];

  const isLoading = userLoading || artworksLoading || bidsLoading;

  const hasPlacedBids = notEmptyOrNil(placedBids);
  const hasReceivedBids = notEmptyOrNil(receivedBids);

  return (
    <Page
      title="Bids"
      type={PageTypes.auth}
      sx={{ backgroundColor: 'black.10' }}
    >
      <Global
        styles={css`
          body {
            background-color: ${colors.black[5]};
          }
        `}
      />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Body
          sx={{
            ...sx.body,
            alignItems: hasPlacedBids ? 'flex-start' : 'center',
          }}
        >
          <Box sx={{ maxWidth: 1280, width: '100%', marginX: 'auto' }}>
            {(hasReceivedBids || hasPlacedBids) && (
              <Heading
                sx={{
                  paddingTop: [0, null, 'l'],
                  marginBottom: ['l', null, 'xxl'],
                  textAlign: 'center',
                }}
                variant="h.l"
              >
                Bids
              </Heading>
            )}

            {hasPlacedBids && (
              <>
                <Heading
                  variant="h.s"
                  sx={{ textAlign: 'center', marginBottom: ['s', null, 'xl'] }}
                >
                  Bids you’ve placed
                </Heading>
                <PrimaryBidsTable bids={placedBids} artworks={artworks} />
              </>
            )}

            {hasReceivedBids && (
              <>
                <Heading
                  variant="h.s"
                  sx={{ textAlign: 'center', marginBottom: ['s', null, 'xl'] }}
                >
                  Bids you’ve received
                </Heading>
                <SecondaryBidsTable bids={receivedBids} artworks={artworks} />
              </>
            )}

            {!hasReceivedBids && !hasPlacedBids && <BidsEmptyState />}
          </Box>
        </Body>
      )}
    </Page>
  );
}

const getStyles = () => ({
  body: {
    paddingTop: [0, 'm', 'l', 'xxl'],
    paddingBottom: 'xxxl',
    flex: 'auto',
    display: 'flex',
    justifyContent: 'center',
  },
});

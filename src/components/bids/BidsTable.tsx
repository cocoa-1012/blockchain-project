/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { find, propEq } from 'ramda';

import BidActivityCard from 'components/bids/BidActivityCard';

import Bid from 'types/Bid';
import Artwork from 'types/Artwork';
import SecondaryBidActivityCard from './SecondaryBidActivityCard';
import { NftMarketAuction } from '@f8n/f8n-contracts/src/types/generated/subgraph';

const findArtwork = (tokenId: number, artworks: Artwork[]) =>
  find<Artwork>(propEq<string>('tokenId', tokenId), artworks);

interface PrimaryBidsTableProps {
  bids: Bid[];
  artworks: Artwork[];
}

interface SecondaryBidsTableProps {
  bids: NftMarketAuction[];
  artworks: Artwork[];
}

export function PrimaryBidsTable(props: PrimaryBidsTableProps): JSX.Element {
  const { bids, artworks } = props;

  return (
    <Grid gap="l" sx={{ mb: 'xxxl' }}>
      {bids.map((bid: Bid, key) => (
        <BidActivityCard
          key={key}
          bid={bid}
          artwork={findArtwork(Number(bid.nft.tokenId), artworks)}
        />
      ))}
    </Grid>
  );
}

export function SecondaryBidsTable(
  props: SecondaryBidsTableProps
): JSX.Element {
  const { bids, artworks } = props;

  return (
    <Grid gap="l">
      {bids.map((bid: NftMarketAuction, key) => (
        <SecondaryBidActivityCard
          key={key}
          bid={bid}
          artwork={findArtwork(Number(bid.nft.tokenId), artworks)}
        />
      ))}
    </Grid>
  );
}

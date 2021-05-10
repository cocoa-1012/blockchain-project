import { gql } from '@apollo/client';
import { AuctionFragment, BidFragment } from './subgraph/fragments';

export const GET_ACCOUNT_BIDS = gql`
  query getAccountBids($publicKey: String!) {
    placedBids: nftMarketBids(
      orderBy: datePlaced
      orderDirection: desc
      first: 250
      where: { status_not: FinalizedWinner, bidder: $publicKey }
    ) {
      ...BidFragment
      nft {
        tokenId
      }
      nftMarketAuction {
        ...AuctionFragment
        highestBid {
          ...BidFragment
        }
      }
    }

    receivedBids: account(id: $publicKey) {
      nftMarketAuctions(where: { status: Open, highestBid_not: null }) {
        ...AuctionFragment
        nft {
          tokenId
        }
        bids {
          ...BidFragment
        }
        highestBid {
          ...BidFragment
        }
      }
    }
  }
  ${BidFragment}
  ${AuctionFragment}
`;

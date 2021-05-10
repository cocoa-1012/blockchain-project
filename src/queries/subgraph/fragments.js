/* eslint-disable max-lines */
import { gql } from '@apollo/client';

export const BidFragment = gql`
  fragment BidFragment on NftMarketBid {
    amountInETH
    status
    datePlaced
    bidder {
      id
    }
  }
`;

export const AuctionFragment = gql`
  fragment AuctionFragment on NftMarketAuction {
    id
    auctionId
    duration
    status
    reservePriceInETH
    seller {
      id
    }
    dateEnding
    dateStarted
    dateCreated
    transactionHashCreated
  }
`;

export const NftHistoryFragment = gql`
  fragment NftHistoryFragment on NftHistory {
    id
    event
    date
    marketplace
    transactionHash
    amountInETH
    actorAccount {
      id
    }
    nftRecipient {
      id
    }
  }
`;

export const NftBaseFragment = gql`
  fragment NftBaseFragment on Nft {
    id
    tokenId
    dateMinted
  }
`;

export const NftPercentSplitFragment = gql`
  fragment NftPercentSplitFragment on Nft {
    percentSplit {
      id
      shares {
        id
        account {
          id
        }
        shareInPercent
      }
    }
  }
`;

export const NftOwnershipFragment = gql`
  fragment NftOwnershipFragment on Nft {
    ownedOrListedBy {
      id
    }
    creator {
      id
    }
  }
`;

export const NftFragment = gql`
  fragment NftFragment on Nft {
    ...NftBaseFragment
    ...NftOwnershipFragment
    nftHistory(orderBy: date, orderDirection: desc, first: 5) {
      event
    }
    mostRecentAuction {
      status
      dateEnding
    }
    mostRecentActiveAuction {
      ...AuctionFragment
      highestBid {
        ...BidFragment
      }
    }
  }
  ${NftBaseFragment}
  ${NftOwnershipFragment}
  ${AuctionFragment}
  ${BidFragment}
`;

export const NftWithHistoryFragment = gql`
  fragment NftWithHistoryFragment on Nft {
    ...NftBaseFragment
    ...NftOwnershipFragment
    mostRecentActiveAuction {
      ...AuctionFragment
      bids(orderBy: amountInETH, orderDirection: desc) {
        ...BidFragment
      }
      highestBid {
        ...BidFragment
      }
    }
    nftHistory(orderBy: date, orderDirection: desc) {
      ...NftHistoryFragment
    }
  }
  ${NftBaseFragment}
  ${NftOwnershipFragment}
  ${AuctionFragment}
  ${BidFragment}
  ${NftHistoryFragment}
`;

export const NftWithBidsFragment = gql`
  fragment NftWithBidsFragment on Nft {
    ...NftBaseFragment
    ...NftOwnershipFragment
    nftHistory(orderBy: date, orderDirection: desc, first: 1) {
      event
    }
    mostRecentActiveAuction {
      ...AuctionFragment
      bids(orderBy: datePlaced, orderDirection: desc) {
        ...BidFragment
      }
      highestBid {
        ...BidFragment
      }
    }
  }
  ${NftBaseFragment}
  ${NftOwnershipFragment}
  ${AuctionFragment}
  ${BidFragment}
`;

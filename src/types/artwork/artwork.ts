export enum ComputedArtworkStatus {
  /** The original mint event for this NFT */
  Minted = 'MINT',
  /** The NFT has been listed for sale */
  Listed = 'LIST',

  ListedButNotByMe = 'LISTED_BUT_NOT_BY_ME',

  LiveAuction = 'LIVE_AUCTION',

  Unsettled = 'UNSETTLED',
  /** The sale has been settled on-chain and the NFT was transferred to the new owner */
  Settled = 'SETTLE',
  /** The NFT was transferred from one address to another */
  Transferred = 'TRANSFER',
  /** The NFT was burned and now no longer available on-chain */
  Burned = 'BURN',
}

// enums are uppercase in the db
export enum ArtworkStatusInDB {
  Minted = 'MINTED',
}

export enum ArtworkAndOwnerStatus {
  MintedOwner = 'MintedOwner',
  MintedNonOwner = 'MintedNonOwner',
  TransferredOwner = 'TransferredOwner',
  TransferredNonOwner = 'TransferredNonOwner',
  ListedOwner = 'ListedOwner',
  ListedNonOwner = 'ListedNonOwner',
  PriceChangedOwner = 'PriceChangedOwner',
  PriceChangedNonOwner = 'PriceChangedNonOwner',
  UnlistedOwner = 'UnlistedOwner',
  UnlistedNonOwner = 'UnlistedNonOwner',
  InAuctionOwner = 'InAuctionOwner',
  InAuctionNonOwner = 'InAuctionNonOwner',
  SoldOwner = 'SoldOwner',
  SoldNonOwner = 'SoldNonOwner',
  SettledOwner = 'SettledOwner',
  SettledNonOwner = 'SettledNonOwner',
}

export enum ArtworkSortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum ArtworkSortKey {
  Price = 'Price',
  DateMinted = 'Date Minted',
}

export enum ArtworkFilter {
  LiveAuction = 'Live auction',
  ReserveNotMet = 'Reserve not met',
  Sold = 'Sold',
}

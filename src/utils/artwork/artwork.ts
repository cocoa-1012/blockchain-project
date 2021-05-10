/* eslint-disable max-lines */
import { getNFT721Address } from 'lib/addresses';
import {
  propEq,
  reject,
  filter,
  map,
  prop,
  compose,
  isNil,
  when,
  cond,
  always,
  T,
  descend,
  sort,
  indexOf,
  path,
  allPass,
  curry,
  head,
  last,
  includes,
  length,
  splitEvery,
  transpose,
} from 'ramda';
import slugify from 'underscore.string/slugify';

import { parseDateToUnix } from 'utils/dates/dates';
import { areKeysEqual } from 'utils/users';
import { maybeLowerCase } from 'utils/case';
import { getUsernameOrAddress, notEmpty, notEmptyOrNil } from 'utils/helpers';
import {
  filterMigrationHistoryEvents,
  getArtworkHistory,
  isBidEventAfterAuctionClose,
  isBidEventAfterAuctionCloseV2,
} from 'utils/history';
import {
  getFirstAuction,
  isAuctionStatusOpenOrFinalized,
  isAuctionLive,
} from 'utils/auctions/auctions';

import { AuctionFragment } from 'graphql/hasura/hasura-fragments.generated';
import { EventType, LatestArtworkEvent } from 'types/Event';
import {
  HistoricalEvent,
  NftHistory,
} from '@f8n/f8n-contracts/src/types/generated/subgraph';
import {
  ComputedArtworkStatus,
  ArtworkStatusInDB,
  ArtworkAndOwnerStatus,
} from 'types/artwork/artwork';
import Artwork, { ArtworkV2 } from 'types/Artwork';
import Account, { PolymorphicAccount } from 'types/Account';

import Auction, { AuctionStatus } from 'types/Auction';
import WalletUser from 'types/WalletUser';

type ArtworkMeta = {
  id: string;
  tokenId?: number;
  name?: string;
};

const nftContractAddr = getNFT721Address();

export function buildNFTSlug(tokenId: string): string {
  return nftContractAddr + '-' + tokenId;
}

// if the tokenId is included in the list, sort it in order
export const getSortedArtworks = (artworks: string[]) =>
  sort<Artwork>((a, b) => {
    const firstIndex = indexOf(a.tokenId, artworks);
    const secondIndex = indexOf(b.tokenId, artworks);
    return firstIndex - secondIndex;
  });

export const getArtworkTokenId = (artwork: ArtworkMeta): string =>
  artwork?.tokenId?.toString();

export const getArtworkIds = compose(reject(isNil), map(getArtworkTokenId));

export const buildNFTSymbol = when(notEmptyOrNil, maybeLowerCase);

export const getSlug = (product: ArtworkMeta): string => {
  const name = product?.name;
  const slugName = slugify(name, { lower: true });
  const slug = notEmptyOrNil(slugName) ? slugName : 'nft';

  return `${slug}-`;
};

export const getTokenSymbolFromProduct = (product: ArtworkMeta): string => {
  const tokenId = getArtworkTokenId(product) || product?.id;
  const slug = getSlug(product);
  const tokenSymbol = buildNFTSymbol(slug + tokenId);
  return tokenSymbol;
};

interface BuildArtworkPathProps {
  user: PolymorphicAccount;
  artwork: ArtworkMeta;
}

interface BuildUserProfilePathProps {
  user: PolymorphicAccount;
}

export function buildArtworkPath({
  user,
  artwork,
}: BuildArtworkPathProps): string {
  const username = getUsernameOrAddress(user);
  const artworkSymbol = getTokenSymbolFromProduct(artwork);
  return `/${username}/${artworkSymbol}`;
}

export function buildUserProfilePath({
  user,
}: BuildUserProfilePathProps): string {
  const username = getUsernameOrAddress(user);
  return `/${username}`;
}

export function buildCreatorArtworkPath(artwork: ArtworkMeta): string {
  const artworkSymbol = getTokenSymbolFromProduct(artwork);
  return `/creator/${artworkSymbol}`;
}

// TODO: Make a shared helper that can be used on FeaturedArtwork and ArtworkCardPrices
// with the original scope of isTransferredOwner for primary markets

// TODO: Handle the case where a listing happens after this
export const isTransferredOwnerMostRecent = (
  history: NftHistory[]
): boolean => {
  return (
    getLastTransferDatetime(history) > getLastSaleDatetime(history) &&
    getLastTransferDatetime(history) > getLastListingDatetime(history)
  );
};

// TODO: Handle the case where a listing happens after this
export const isTransferredOwnerThenListed = (
  history: NftHistory[]
): boolean => {
  return getLastTransferDatetime(history) > getLastSaleDatetime(history);
};

const getHistoryEvent = (event: HistoricalEvent) =>
  compose(
    Number,
    path<string>([0, 'date']),
    filter<NftHistory>(propEq<string>('event', event))
  );

// TODO: Handle empty or nil input in this helper
export const getLastSaleDatetime = getHistoryEvent(HistoricalEvent.Sold);

// TODO: Handle empty or nil input in this helper
export const getLastTransferDatetime = getHistoryEvent(
  HistoricalEvent.Transferred
);

// TODO: Handle empty or nil input in this helper
export const getLastListingDatetime = getHistoryEvent(HistoricalEvent.Listed);

// TODO: Handle empty or nil input in this helper
export const getLastSaleAmount = compose(
  path<string>([0, 'amountInETH']),
  filter<NftHistory>(propEq<string>('event', HistoricalEvent.Sold))
);

// TODO: Handle empty or nil input in this helper
export const getLastSaleUserAddress = compose(
  path<string>([0, 'actorAccount', 'id']),
  filter<NftHistory>(propEq<string>('event', HistoricalEvent.Sold))
);

// TODO: Handle empty or nil input in this helper
export const getLastListUserAddress = compose(
  path<string>([0, 'actorAccount', 'id']),
  filter<NftHistory>(propEq<string>('event', HistoricalEvent.Listed))
);

// TODO: can this use mostRecentActiveAuction instead?
export const getArtworkListedDate = compose<Auction[], Auction, string>(
  prop('dateCreated'),
  getFirstAuction
);

const filterMintedArtworks = filter<Artwork>(
  propEq<string>('status', ArtworkStatusInDB.Minted)
);

export const getMintedAssetIPFSPaths = compose<Artwork[], Artwork[], string[]>(
  map((artwork) => artwork.assetIPFSPath),
  filterMintedArtworks
);

export const getDuplicateMintedArtwork = curry(
  (artwork: Artwork, artworks: Artwork[]) => {
    const rejectFn = compose<Artwork[], Artwork[], Artwork[], Artwork>(
      head,
      reject<Artwork>(propEq<string>('id', artwork?.id)),
      filterMintedArtworks
    );

    return rejectFn(artworks);
  }
);

export const isArtworkListed = allPass([
  (artwork: Artwork) => Boolean(artwork?.mostRecentAuction),
  (artwork) => isAuctionStatusOpenOrFinalized(artwork?.mostRecentAuction),
]);

const getAuctionStarted = compose(
  Number,
  path<string>(['mostRecentActiveAuction', 'dateCreated'])
);

export const sortArtworksByDateListed = sort<Artwork>(
  descend(getAuctionStarted)
);

export const sortFeedArtworks = compose<Artwork[], Artwork[], Artwork[]>(
  sortArtworksByDateListed,
  filter(isArtworkListed)
);

export const queryHasMoreResults = compose(notEmpty, last);

export const getNextPageParam = (
  lastPage: unknown,
  allPages: unknown[]
): number => {
  return notEmpty(lastPage) ? length(allPages) : undefined;
};

const getLatestHistoryEvent = compose<NftHistory[], NftHistory, any>(
  // get the event value from the event
  prop('event'),
  // get the first event
  head
);

export const getComputedArtworkStatus = ({
  artwork,
  user,
}: {
  artwork: Artwork;
  user?: Account;
}): ComputedArtworkStatus => {
  const mostRecentActiveAuction = artwork?.mostRecentActiveAuction;

  const nftHistory = compose(
    filterMigrationHistoryEvents,
    getArtworkHistory
  )(artwork);

  const publicAddress = user?.publicKey;

  // this will return false when both are undefined
  const isSellerCurrentUser = areKeysEqual([
    publicAddress,
    mostRecentActiveAuction?.seller?.id,
  ]);

  // this helper handles the edge-case where an auction
  // ended but hasn’t been settled yet
  const isAuctionUnsettled = isBidEventAfterAuctionClose(
    nftHistory,
    mostRecentActiveAuction
  );

  const isArtworkAuctionLive = isAuctionLive(
    mostRecentActiveAuction?.dateEnding
  );

  // we have to cast this to ComputedArtworkStatus to avoid conflicts
  const latestEventStatus: ComputedArtworkStatus =
    getLatestHistoryEvent(nftHistory);

  // TODO: Make sure that in the case where the historical event is listed,
  // we only map that to listed if nftMarketAuction.seller is the
  // current user

  // TODO: If the only auction is one that's canceled,
  // make sure to map to whatever over thate is most relevant

  // here we reduce + re-map some of the states
  return cond<ComputedArtworkStatus, ComputedArtworkStatus>([
    [() => isArtworkAuctionLive, always(ComputedArtworkStatus.LiveAuction)],
    [() => isAuctionUnsettled, always(ComputedArtworkStatus.Unsettled)],
    [
      (status) => includes(status, [HistoricalEvent.Sold]),
      always(ComputedArtworkStatus.Unsettled),
    ],
    [
      (status) =>
        includes(status, [HistoricalEvent.PriceChanged, HistoricalEvent.Bid]),
      always(ComputedArtworkStatus.Listed),
    ],
    [
      (status) => includes(status, [HistoricalEvent.Unlisted]),
      always(ComputedArtworkStatus.Minted),
    ],
    [
      (status) =>
        !isSellerCurrentUser && includes(status, [HistoricalEvent.Listed]),
      always(ComputedArtworkStatus.ListedButNotByMe),
    ],
    // otherwise just return the latestEventStatus
    [T, (status) => status],
  ])(latestEventStatus);
};

interface ComputedArtworkStatusArgs {
  latestArtworkEvent: LatestArtworkEvent;
  mostRecentActiveAuction: AuctionFragment;
  currentUser: WalletUser;
  isCreatorOwner: boolean;
}

export const getComputedArtworkStatusV2 = ({
  isCreatorOwner,
  mostRecentActiveAuction,
  currentUser,
  latestArtworkEvent,
}: ComputedArtworkStatusArgs): ComputedArtworkStatus => {
  const eventType = latestArtworkEvent?.eventType;
  const auctionStatus = mostRecentActiveAuction?.status;
  const auctionEndsAt = mostRecentActiveAuction?.endsAt;
  const isAuctionFinalized = auctionStatus === AuctionStatus.FINALIZED;

  // this will return false when both are undefined
  const isSellerCurrentUser = areKeysEqual([
    currentUser?.publicAddress,
    mostRecentActiveAuction?.seller,
  ]);

  const unixEndDate = parseDateToUnix(auctionEndsAt);

  // this helper handles the edge-case where an auction
  // ended but hasn’t been settled yet
  const isAuctionUnsettled = isBidEventAfterAuctionCloseV2(
    eventType,
    unixEndDate
  );

  const isArtworkAuctionLive = isAuctionLive(unixEndDate);


  // here we reduce + re-map some of the states
  return cond<EventType, ComputedArtworkStatus>([
    [() => isArtworkAuctionLive, always(ComputedArtworkStatus.LiveAuction)],
    [() => isAuctionUnsettled, always(ComputedArtworkStatus.Unsettled)],
    [
      (status) =>
        includes(status, [EventType.PriceChanged, HistoricalEvent.Bid]),
      always(ComputedArtworkStatus.Listed),
    ],
    [
      (status) => isAuctionFinalized && includes(status, [EventType.Unlisted]),
      always(ComputedArtworkStatus.Settled),
    ],
    [
      (status) => isCreatorOwner && includes(status, [EventType.Unlisted]),
      always(ComputedArtworkStatus.Minted),
    ],
    [
      (status) => !isCreatorOwner && includes(status, [EventType.Unlisted]),
      always(ComputedArtworkStatus.Transferred),
    ],
    [
      (status) => !isSellerCurrentUser && includes(status, [EventType.Listed]),
      always(ComputedArtworkStatus.ListedButNotByMe),
    ],
    // otherwise just return the latestEventStatus
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [T, (status) => status],
  ])(eventType);
};

export function splitArray<T>(arr: T[], length: number): T[][] {
  // [1, 2, 3, 4, 5, 6] becomes [[1, 2, 3], [4, 5, 6]]
  const result = splitEvery(length, arr);
  // [[1, 4], [2, 5], [3, 6]]
  return transpose(result);
}

// Feed Artwork & Ownership Statuses
export const getArtworkAndOwnerStatus = cond<
  { event: HistoricalEvent; isOwner: boolean },
  ArtworkAndOwnerStatus
>([
  // MintedOwner
  [
    allPass([propEq('event', HistoricalEvent.Minted), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.MintedOwner),
  ],
  // MintedNonOwner,
  [
    propEq('event', HistoricalEvent.Minted),
    always(ArtworkAndOwnerStatus.MintedNonOwner),
  ],
  // TransferredOwner
  [
    allPass([propEq('event', HistoricalEvent.Transferred), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.TransferredOwner),
  ],
  // TransferredNonOwner
  [
    propEq('event', HistoricalEvent.Transferred),
    always(ArtworkAndOwnerStatus.TransferredNonOwner),
  ],
  // ListedOwner
  [
    allPass([propEq('event', HistoricalEvent.Listed), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.ListedOwner),
  ],
  // ListedNonOwner
  [
    propEq('event', HistoricalEvent.Listed),
    always(ArtworkAndOwnerStatus.ListedNonOwner),
  ],
  // PriceChangedOwner
  [
    allPass([propEq('event', HistoricalEvent.PriceChanged), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.PriceChangedOwner),
  ],
  // PriceChangedNonOwner
  [
    propEq('event', HistoricalEvent.PriceChanged),
    always(ArtworkAndOwnerStatus.PriceChangedNonOwner),
  ],
  // UnlistedOwner
  [
    allPass([propEq('event', HistoricalEvent.Unlisted), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.UnlistedOwner),
  ],
  // UnlistedNonOwner
  [
    propEq('event', HistoricalEvent.Unlisted),
    always(ArtworkAndOwnerStatus.UnlistedNonOwner),
  ],
  // InAuctionOwner
  [
    allPass([propEq('event', HistoricalEvent.Bid), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.InAuctionOwner),
  ],
  // InAuctionNonOwner
  [
    propEq('event', HistoricalEvent.Bid),
    always(ArtworkAndOwnerStatus.InAuctionNonOwner),
  ],
  // SoldOwner
  [
    allPass([propEq('event', HistoricalEvent.Sold), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.SoldOwner),
  ],
  // SoldNonOwner
  [
    propEq('event', HistoricalEvent.Sold),
    always(ArtworkAndOwnerStatus.SoldNonOwner),
  ],
  // SettledOwner
  [
    allPass([propEq('event', HistoricalEvent.Settled), prop('isOwner')]),
    always(ArtworkAndOwnerStatus.SettledOwner),
  ],
  // SettledNonOwner
  [
    propEq('event', HistoricalEvent.Settled),
    always(ArtworkAndOwnerStatus.SettledNonOwner),
  ],
  [T, () => null],
]);

export const rejectUserHiddenArtworks = <T extends ArtworkV2>(
  artworks: T[]
): T[] =>
  reject<T>(
    (artwork) => notEmptyOrNil(artwork.artworkUserVisibilities),
    artworks
  );

import * as Types from './types-hasura.generated';

export type ArtworkFragment = Pick<Types.Artwork, 'id' | 'name' | 'description' | 'assetIPFSPath' | 'metadataIPFSPath' | 'width' | 'height' | 'duration' | 'mimeType' | 'mintTxHash' | 'assetId' | 'assetStatus' | 'tokenId' | 'status' | 'hiddenAt' | 'deletedAt' | 'moderationStatus' | 'moderationFrom' | 'latestTxDate' | 'assetVersion' | 'ownerPublicKey' | 'publicKey' | 'tags'>;

export type UserFragment = Pick<Types.User, 'userIndex' | 'publicKey' | 'username' | 'profileImageUrl' | 'coverImageUrl' | 'name' | 'bio' | 'isApprovedCreator' | 'moderationStatus' | 'joinedWaitlistAt' | 'createdAt' | 'migratedToUser' | 'isApprovedForMigrationAt' | 'isAdmin' | 'links'>;

export type InviteFragment = Pick<Types.Invite_Code, 'senderPublicKey' | 'redeemerPublicKey' | 'redeemedAt'>;

export type FollowFragment = Pick<Types.Follow, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'followedUser' | 'isFollowing'>;

export type SocialVerificationFragment = Pick<Types.Social_Verification, 'id' | 'user' | 'createdAt' | 'updatedAt' | 'lastCheckedAt' | 'socialVerificationURL' | 'verificationText' | 'userId' | 'username' | 'isValid' | 'service' | 'failedReason' | 'status'>;

export type UserProfileFragment = (
  { acceptedInvite?: Types.Maybe<InviteFragment>, twitSocialVerifs: Array<SocialVerificationFragment>, instaSocialVerifs: Array<SocialVerificationFragment> }
  & UserFragment
);

export type FeedUserFragment = (
  { followerCount: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> }, follows: Array<Pick<Types.Follow, 'createdAt' | 'isFollowing'>> }
  & UserFragment
);

export type AuctionFragment = (
  Pick<Types.Auction, 'auctionId' | 'canceledAt' | 'createdAt' | 'endsAt' | 'finalizedAt' | 'highestBidAmount' | 'highestBidder' | 'id' | 'isPrimarySale' | 'reservePriceInETH' | 'seller' | 'startsAt' | 'status' | 'tokenId' | 'updatedAt'>
  & { highestBidderUser?: Types.Maybe<Pick<Types.User, 'userIndex' | 'publicKey' | 'username' | 'profileImageUrl' | 'coverImageUrl' | 'name'>> }
);

export type LatestArtworkEventFragment = { latestEvents: Array<Pick<Types.Event, 'eventType' | 'data'>> };

export type ArtworkSplitRecipientsFragment = { splitRecipients: { aggregate?: Types.Maybe<Pick<Types.Split_Recipient_Aggregate_Fields, 'count'>> } };

export type CollectionArtworkFragment = (
  { owner?: Types.Maybe<UserFragment>, creator?: Types.Maybe<UserFragment>, auctions: Array<AuctionFragment> }
  & ArtworkFragment
  & LatestArtworkEventFragment
  & ArtworkSplitRecipientsFragment
);

export const FollowFragment = /*#__PURE__*/ `
    fragment FollowFragment on follow {
  id
  createdAt
  updatedAt
  user
  followedUser
  isFollowing
}
    `;
export const UserFragment = /*#__PURE__*/ `
    fragment UserFragment on user {
  userIndex
  publicKey
  username
  profileImageUrl
  coverImageUrl
  name
  bio
  isApprovedCreator
  moderationStatus
  joinedWaitlistAt
  createdAt
  migratedToUser
  isApprovedForMigrationAt
  isAdmin
  links
}
    `;
export const InviteFragment = /*#__PURE__*/ `
    fragment InviteFragment on invite_code {
  senderPublicKey
  redeemerPublicKey
  redeemedAt
}
    `;
export const SocialVerificationFragment = /*#__PURE__*/ `
    fragment SocialVerificationFragment on social_verification {
  id
  user
  createdAt
  updatedAt
  lastCheckedAt
  socialVerificationURL
  verificationText
  userId
  username
  isValid
  service
  failedReason
  status
}
    `;
export const UserProfileFragment = /*#__PURE__*/ `
    fragment UserProfileFragment on user {
  ...UserFragment
  acceptedInvite {
    ...InviteFragment
  }
  twitSocialVerifs: socialVerifications(
    where: {isValid: {_eq: true}, service: {_eq: "TWITTER"}}
    limit: 1
  ) {
    ...SocialVerificationFragment
  }
  instaSocialVerifs: socialVerifications(
    where: {isValid: {_eq: true}, service: {_eq: "INSTAGRAM"}}
    limit: 1
  ) {
    ...SocialVerificationFragment
  }
}
    ${UserFragment}
${InviteFragment}
${SocialVerificationFragment}`;
export const FeedUserFragment = /*#__PURE__*/ `
    fragment FeedUserFragment on user {
  ...UserFragment
  followerCount: follows_aggregate(where: {isFollowing: {_eq: true}}) {
    aggregate {
      count
    }
  }
  follows(where: {user: {_eq: $publicKey}, isFollowing: {_eq: true}}) {
    createdAt
    isFollowing
  }
}
    ${UserFragment}`;
export const ArtworkFragment = /*#__PURE__*/ `
    fragment ArtworkFragment on artwork {
  id
  name
  description
  assetIPFSPath
  metadataIPFSPath
  width
  height
  duration
  mimeType
  mintTxHash
  assetId
  assetStatus
  mintTxHash
  tokenId
  status
  hiddenAt
  deletedAt
  moderationStatus
  moderationFrom
  latestTxDate
  assetVersion
  ownerPublicKey
  publicKey
  tags
}
    `;
export const LatestArtworkEventFragment = /*#__PURE__*/ `
    fragment LatestArtworkEventFragment on artwork {
  latestEvents: event(
    where: {eventType: {_nin: ["MIGRATE_CREATOR", "MIGRATE_CREATOR_PAYMENT_ADDRESS", "MIGRATE_OWNER", "MIGRATE_SELLER", "SELL", "PRICE_CHANGE"]}}
    limit: 1
    order_by: {blockTimestamp: desc}
  ) {
    eventType
    data
  }
}
    `;
export const ArtworkSplitRecipientsFragment = /*#__PURE__*/ `
    fragment ArtworkSplitRecipientsFragment on artwork {
  splitRecipients: splitRecipients_aggregate {
    aggregate {
      count
    }
  }
}
    `;
export const AuctionFragment = /*#__PURE__*/ `
    fragment AuctionFragment on auction {
  auctionId
  canceledAt
  createdAt
  endsAt
  finalizedAt
  highestBidAmount
  highestBidder
  id
  isPrimarySale
  reservePriceInETH
  seller
  startsAt
  status
  tokenId
  updatedAt
  highestBidderUser {
    userIndex
    publicKey
    username
    profileImageUrl
    coverImageUrl
    name
  }
}
    `;
export const CollectionArtworkFragment = /*#__PURE__*/ `
    fragment CollectionArtworkFragment on artwork {
  ...ArtworkFragment
  ...LatestArtworkEventFragment
  ...ArtworkSplitRecipientsFragment
  owner {
    ...UserFragment
  }
  creator: user {
    ...UserFragment
  }
  auctions(
    where: {status: {_in: ["OPEN", "FINALIZED", "ENDED"]}}
    order_by: {startsAt: desc}
  ) {
    ...AuctionFragment
  }
}
    ${ArtworkFragment}
${LatestArtworkEventFragment}
${ArtworkSplitRecipientsFragment}
${UserFragment}
${AuctionFragment}`;
import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserArtworksCountsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  indexedStates: Array<Types.Scalars['Boolean']> | Types.Scalars['Boolean'];
}>;


export type UserArtworksCounts = { artworksCreated: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> }, artworksCreatedHidden: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> }, artworksCollected: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> }, artworksCollectedHidden: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> }, userSplits?: Types.Maybe<{ splitRecipients: Array<{ artworks_aggregate: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> } }> }>, userSplitsHidden?: Types.Maybe<{ splitRecipients: Array<{ artworks_aggregate: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> } }> }>, artworksHidden: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> } };


export const UserArtworksCountsDocument = /*#__PURE__*/ `
    query UserArtworksCounts($publicKey: String!, $indexedStates: [Boolean!]!) {
  artworksCreated: artwork_aggregate(
    where: {publicKey: {_eq: $publicKey}, isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
  artworksCreatedHidden: artwork_aggregate(
    where: {publicKey: {_eq: $publicKey}, isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}, artworkUserVisibilities: {hiddenAt: {_is_null: false}, publicKey: {_eq: $publicKey}}}
  ) {
    aggregate {
      count
    }
  }
  artworksCollected: artwork_aggregate(
    where: {ownerPublicKey: {_eq: $publicKey}, publicKey: {_neq: $publicKey}, isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
  artworksCollectedHidden: artwork_aggregate(
    where: {ownerPublicKey: {_eq: $publicKey}, publicKey: {_neq: $publicKey}, isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}, artworkUserVisibilities: {hiddenAt: {_is_null: false}, publicKey: {_eq: $publicKey}}}
  ) {
    aggregate {
      count
    }
  }
  userSplits: user_by_pk(publicKey: $publicKey) {
    splitRecipients {
      artworks_aggregate(
        where: {isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}}
      ) {
        aggregate {
          count
        }
      }
    }
  }
  userSplitsHidden: user_by_pk(publicKey: $publicKey) {
    splitRecipients {
      artworks_aggregate(
        where: {isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}, artworkUserVisibilities: {hiddenAt: {_is_null: false}, publicKey: {_eq: $publicKey}}}
      ) {
        aggregate {
          count
        }
      }
    }
  }
  artworksHidden: artwork_aggregate(
    where: {_or: [{ownerPublicKey: {_eq: $publicKey}}, {splitRecipients: {user: {publicKey: {_eq: $publicKey}}}}], isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}, artworkUserVisibilities: {hiddenAt: {_is_null: false}, publicKey: {_eq: $publicKey}}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const useUserArtworksCounts = <
      TData = UserArtworksCounts,
      TError = Error
    >(
      variables: UserArtworksCountsVariables, 
      options?: UseQueryOptions<UserArtworksCounts, TError, TData>
    ) => 
    useQuery<UserArtworksCounts, TError, TData>(
      ['UserArtworksCounts', variables],
      hasuraFetcher<UserArtworksCounts, UserArtworksCountsVariables>(UserArtworksCountsDocument, variables),
      options
    );
useUserArtworksCounts.getKey = (variables: UserArtworksCountsVariables) => ['UserArtworksCounts', variables];

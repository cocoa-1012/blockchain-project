import * as Types from '../types-hasura.generated';

import { CollectionArtworkFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserArtworksCollectedVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  limit?: Types.Maybe<Types.Scalars['Int']>;
  offset?: Types.Maybe<Types.Scalars['Int']>;
  indexedStates: Array<Types.Scalars['Boolean']> | Types.Scalars['Boolean'];
}>;


export type UserArtworksCollected = { artworks: Array<(
    { artworkUserVisibilities: Array<Pick<Types.Artwork_User_Visibility, 'hiddenAt'>> }
    & CollectionArtworkFragment
  )> };


export const UserArtworksCollectedDocument = /*#__PURE__*/ `
    query UserArtworksCollected($publicKey: String!, $limit: Int, $offset: Int, $indexedStates: [Boolean!]!) {
  artworks: artwork(
    where: {ownerPublicKey: {_eq: $publicKey}, publicKey: {_neq: $publicKey}, isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}}
    order_by: {latestTxDate: desc_nulls_last}
    limit: $limit
    offset: $offset
  ) {
    ...CollectionArtworkFragment
    artworkUserVisibilities(
      where: {publicKey: {_eq: $publicKey}, hiddenAt: {_is_null: false}}
    ) {
      hiddenAt
    }
  }
}
    ${CollectionArtworkFragment}`;
export const useUserArtworksCollected = <
      TData = UserArtworksCollected,
      TError = Error
    >(
      variables: UserArtworksCollectedVariables, 
      options?: UseQueryOptions<UserArtworksCollected, TError, TData>
    ) => 
    useQuery<UserArtworksCollected, TError, TData>(
      ['UserArtworksCollected', variables],
      hasuraFetcher<UserArtworksCollected, UserArtworksCollectedVariables>(UserArtworksCollectedDocument, variables),
      options
    );
useUserArtworksCollected.getKey = (variables: UserArtworksCollectedVariables) => ['UserArtworksCollected', variables];

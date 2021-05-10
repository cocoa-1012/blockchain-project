import * as Types from '../types-hasura.generated';

import { CollectionArtworkFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserArtworksHiddenVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  limit?: Types.Maybe<Types.Scalars['Int']>;
  offset?: Types.Maybe<Types.Scalars['Int']>;
  indexedStates: Array<Types.Scalars['Boolean']> | Types.Scalars['Boolean'];
}>;


export type UserArtworksHidden = { artworks: Array<(
    { artworkUserVisibilities: Array<Pick<Types.Artwork_User_Visibility, 'hiddenAt'>> }
    & CollectionArtworkFragment
  )> };


export const UserArtworksHiddenDocument = /*#__PURE__*/ `
    query UserArtworksHidden($publicKey: String!, $limit: Int, $offset: Int, $indexedStates: [Boolean!]!) {
  artworks: artwork(
    where: {_or: [{ownerPublicKey: {_eq: $publicKey}}, {splitRecipients: {user: {publicKey: {_eq: $publicKey}}}}], isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}, artworkUserVisibilities: {hiddenAt: {_is_null: false}, publicKey: {_eq: $publicKey}}}
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
export const useUserArtworksHidden = <
      TData = UserArtworksHidden,
      TError = Error
    >(
      variables: UserArtworksHiddenVariables, 
      options?: UseQueryOptions<UserArtworksHidden, TError, TData>
    ) => 
    useQuery<UserArtworksHidden, TError, TData>(
      ['UserArtworksHidden', variables],
      hasuraFetcher<UserArtworksHidden, UserArtworksHiddenVariables>(UserArtworksHiddenDocument, variables),
      options
    );
useUserArtworksHidden.getKey = (variables: UserArtworksHiddenVariables) => ['UserArtworksHidden', variables];

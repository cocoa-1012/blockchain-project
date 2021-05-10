import * as Types from '../types-hasura.generated';

import { CollectionArtworkFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserArtworksSplitsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  limit?: Types.Maybe<Types.Scalars['Int']>;
  offset?: Types.Maybe<Types.Scalars['Int']>;
  indexedStates: Array<Types.Scalars['Boolean']> | Types.Scalars['Boolean'];
}>;


export type UserArtworksSplits = { artworks: Array<(
    { artworkUserVisibilities: Array<Pick<Types.Artwork_User_Visibility, 'hiddenAt'>> }
    & CollectionArtworkFragment
  )> };


export const UserArtworksSplitsDocument = /*#__PURE__*/ `
    query UserArtworksSplits($publicKey: String!, $limit: Int, $offset: Int, $indexedStates: [Boolean!]!) {
  artworks: artwork(
    where: {isIndexed: {_in: $indexedStates}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}, splitRecipients: {publicKey: {_eq: $publicKey}}}
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
export const useUserArtworksSplits = <
      TData = UserArtworksSplits,
      TError = Error
    >(
      variables: UserArtworksSplitsVariables, 
      options?: UseQueryOptions<UserArtworksSplits, TError, TData>
    ) => 
    useQuery<UserArtworksSplits, TError, TData>(
      ['UserArtworksSplits', variables],
      hasuraFetcher<UserArtworksSplits, UserArtworksSplitsVariables>(UserArtworksSplitsDocument, variables),
      options
    );
useUserArtworksSplits.getKey = (variables: UserArtworksSplitsVariables) => ['UserArtworksSplits', variables];

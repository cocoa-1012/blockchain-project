import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserArtworksCreatedCountVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;


export type UserArtworksCreatedCount = { artworksCreatedCount: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> } };


export const UserArtworksCreatedCountDocument = /*#__PURE__*/ `
    query UserArtworksCreatedCount($publicKey: String!) {
  artworksCreatedCount: artwork_aggregate(
    where: {publicKey: {_eq: $publicKey}, isIndexed: {_eq: true}, tokenId: {_is_null: false}, deletedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const useUserArtworksCreatedCount = <
      TData = UserArtworksCreatedCount,
      TError = Error
    >(
      variables: UserArtworksCreatedCountVariables, 
      options?: UseQueryOptions<UserArtworksCreatedCount, TError, TData>
    ) => 
    useQuery<UserArtworksCreatedCount, TError, TData>(
      ['UserArtworksCreatedCount', variables],
      hasuraFetcher<UserArtworksCreatedCount, UserArtworksCreatedCountVariables>(UserArtworksCreatedCountDocument, variables),
      options
    );
useUserArtworksCreatedCount.getKey = (variables: UserArtworksCreatedCountVariables) => ['UserArtworksCreatedCount', variables];

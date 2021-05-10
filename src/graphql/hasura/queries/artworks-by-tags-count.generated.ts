import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworksByTagsCountVariables = Types.Exact<{
  tag: Types.Scalars['jsonb'];
}>;


export type ArtworksByTagsCount = { artworksCount: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> } };


export const ArtworksByTagsCountDocument = /*#__PURE__*/ `
    query ArtworksByTagsCount($tag: jsonb!) {
  artworksCount: artwork_aggregate(
    where: {tags: {_contains: $tag}, isIndexed: {_eq: true}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const useArtworksByTagsCount = <
      TData = ArtworksByTagsCount,
      TError = Error
    >(
      variables: ArtworksByTagsCountVariables, 
      options?: UseQueryOptions<ArtworksByTagsCount, TError, TData>
    ) => 
    useQuery<ArtworksByTagsCount, TError, TData>(
      ['ArtworksByTagsCount', variables],
      hasuraFetcher<ArtworksByTagsCount, ArtworksByTagsCountVariables>(ArtworksByTagsCountDocument, variables),
      options
    );
useArtworksByTagsCount.getKey = (variables: ArtworksByTagsCountVariables) => ['ArtworksByTagsCount', variables];

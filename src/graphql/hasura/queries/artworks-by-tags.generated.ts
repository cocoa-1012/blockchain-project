import * as Types from '../types-hasura.generated';

import { CollectionArtworkFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworksByTagsVariables = Types.Exact<{
  tag: Types.Scalars['jsonb'];
  limit?: Types.Maybe<Types.Scalars['Int']>;
  offset?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type ArtworksByTags = { artworks: Array<CollectionArtworkFragment> };


export const ArtworksByTagsDocument = /*#__PURE__*/ `
    query ArtworksByTags($tag: jsonb!, $limit: Int, $offset: Int) {
  artworks: artwork(
    where: {tags: {_contains: $tag}, isIndexed: {_eq: true}}
    order_by: {latestTxDate: desc_nulls_last}
    limit: $limit
    offset: $offset
  ) {
    ...CollectionArtworkFragment
  }
}
    ${CollectionArtworkFragment}`;
export const useArtworksByTags = <
      TData = ArtworksByTags,
      TError = Error
    >(
      variables: ArtworksByTagsVariables, 
      options?: UseQueryOptions<ArtworksByTags, TError, TData>
    ) => 
    useQuery<ArtworksByTags, TError, TData>(
      ['ArtworksByTags', variables],
      hasuraFetcher<ArtworksByTags, ArtworksByTagsVariables>(ArtworksByTagsDocument, variables),
      options
    );
useArtworksByTags.getKey = (variables: ArtworksByTagsVariables) => ['ArtworksByTags', variables];

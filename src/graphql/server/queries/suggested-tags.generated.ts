import * as Types from '../types-server.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type SuggestedTagsVariables = Types.Exact<{ [key: string]: never; }>;


export type SuggestedTags = Pick<Types.Query, 'getSuggestedTags'>;


export const SuggestedTagsDocument = /*#__PURE__*/ `
    query SuggestedTags {
  getSuggestedTags
}
    `;
export const useSuggestedTags = <
      TData = SuggestedTags,
      TError = Error
    >(
      variables?: SuggestedTagsVariables, 
      options?: UseQueryOptions<SuggestedTags, TError, TData>
    ) => 
    useQuery<SuggestedTags, TError, TData>(
      ['SuggestedTags', variables],
      useServerFetcher<SuggestedTags, SuggestedTagsVariables>(SuggestedTagsDocument).bind(null, variables),
      options
    );
useSuggestedTags.getKey = (variables?: SuggestedTagsVariables) => ['SuggestedTags', variables];

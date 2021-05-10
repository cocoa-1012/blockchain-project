import * as Types from '../types-server.generated';

import { ArtworkFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateArtworkTagsVariables = Types.Exact<{
  data: Types.UpdateArtworkTagsInput;
}>;


export type UpdateArtworkTags = { updateArtworkTags: ArtworkFragment };


export const UpdateArtworkTagsDocument = /*#__PURE__*/ `
    mutation UpdateArtworkTags($data: UpdateArtworkTagsInput!) {
  updateArtworkTags(data: $data) {
    ...ArtworkFragment
  }
}
    ${ArtworkFragment}`;
export const useUpdateArtworkTags = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateArtworkTags, TError, UpdateArtworkTagsVariables, TContext>) => 
    useMutation<UpdateArtworkTags, TError, UpdateArtworkTagsVariables, TContext>(
      useServerFetcher<UpdateArtworkTags, UpdateArtworkTagsVariables>(UpdateArtworkTagsDocument),
      options
    );
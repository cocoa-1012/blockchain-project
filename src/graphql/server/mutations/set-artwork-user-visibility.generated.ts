import * as Types from '../types-server.generated';

import { ArtworkUserVisibilityFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type SetArtworkUserVisibilityVariables = Types.Exact<{
  shouldHide: Types.Scalars['Boolean'];
  tokenId: Types.Scalars['Float'];
}>;


export type SetArtworkUserVisibility = { setArtworkUserVisibility: ArtworkUserVisibilityFragment };


export const SetArtworkUserVisibilityDocument = /*#__PURE__*/ `
    mutation SetArtworkUserVisibility($shouldHide: Boolean!, $tokenId: Float!) {
  setArtworkUserVisibility(shouldHide: $shouldHide, tokenId: $tokenId) {
    ...ArtworkUserVisibilityFragment
  }
}
    ${ArtworkUserVisibilityFragment}`;
export const useSetArtworkUserVisibility = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<SetArtworkUserVisibility, TError, SetArtworkUserVisibilityVariables, TContext>) => 
    useMutation<SetArtworkUserVisibility, TError, SetArtworkUserVisibilityVariables, TContext>(
      useServerFetcher<SetArtworkUserVisibility, SetArtworkUserVisibilityVariables>(SetArtworkUserVisibilityDocument),
      options
    );
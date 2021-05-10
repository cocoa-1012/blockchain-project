import { useQuery, QueryResult, QueryFunctionOptions } from '@apollo/client';

import Artwork from 'types/Artwork';
import ModerationStatus from 'types/ModerationStatus';
import { SimpleApolloResult } from 'types/Apollo';

import {
  GET_ARTWORK_UNLOCKABLE_CONTENT_BY_TOKEN_ID,
  GET_ARTWORK_UNLOCKABLE_CONTENT,
} from 'queries/server/artworks';
import { HASURA_ARTWORKS_QUERY } from 'queries/hasura/artworks';

import { castTokenIds, getFirstValue } from 'utils/helpers';
import { HasuraArtworkBaseArgs, HasuraArtworkQueryArgs } from './types';
import { filterNonUserStatuses } from 'utils/moderation';

interface ArtworkUnlockableContentData {
  artwork: {
    downloadableUrl: string;
  };
}

interface ArtworkArgs {
  id: string;
}

interface ArtworkUnlockableContentArgs extends QueryFunctionOptions {
  id: string;
  token: string;
}

export function useServerArtworkUnlockableContent({
  id,
  token,
  skip = false,
}: ArtworkUnlockableContentArgs): QueryResult<
  ArtworkUnlockableContentData,
  ArtworkArgs
> {
  return useQuery<ArtworkUnlockableContentData, ArtworkArgs>(
    GET_ARTWORK_UNLOCKABLE_CONTENT,
    {
      variables: { id },
      skip: !id || skip,
      context: { endpoint: 'server', token },
    }
  );
}

interface ArtworksData {
  artworks: Artwork[];
}
interface ArtworkData {
  artwork: Artwork;
}
interface ArtworkByTokenIdArgs
  extends QueryFunctionOptions,
    HasuraArtworkQueryArgs {}

interface ArtworkByTokenIdHookArgs extends HasuraArtworkBaseArgs {
  tokenIds: number[];
}

export function useHasuraArtworkByTokenId({
  tokenId,
  excludeHidden = false,
  moderationStatuses = [ModerationStatus.Active],
  pollInterval,
  skip,
}: ArtworkByTokenIdArgs): SimpleApolloResult<ArtworkData> {
  const { data, loading, error } = useQuery<
    ArtworksData,
    ArtworkByTokenIdHookArgs
  >(HASURA_ARTWORKS_QUERY, {
    // cast the tokenId to a number
    variables: {
      tokenIds: castTokenIds([tokenId]),
      excludeHidden,
      moderationStatuses,
      userModerationStatuses: filterNonUserStatuses(moderationStatuses),
    },
    skip: !tokenId || skip,
    context: { endpoint: 'hasura' },
    pollInterval,
  });

  return {
    data: { artwork: getFirstValue(data?.artworks) },
    loading,
    error,
  };
}

interface UnlockableContentByTokenIdArgs extends QueryFunctionOptions {
  tokenId: string;
  token: string;
}

export function useServerArtworkUnlockableContentByTokenId({
  tokenId,
  token,
  skip,
}: UnlockableContentByTokenIdArgs): QueryResult<
  ArtworkUnlockableContentData,
  ArtworkByTokenIdArgs
> {
  return useQuery<ArtworkUnlockableContentData, ArtworkByTokenIdArgs>(
    GET_ARTWORK_UNLOCKABLE_CONTENT_BY_TOKEN_ID,
    {
      variables: { tokenId },
      skip: !tokenId || skip,
      context: { endpoint: 'server', token },
    }
  );
}

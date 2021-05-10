import {
  useQuery,
  QueryResult,
  QueryFunctionOptions,
  QueryHookOptions,
} from '@apollo/client';

import Artwork from 'types/Artwork';
import Account from 'types/Account';
import ModerationStatus from 'types/ModerationStatus';
import { HasuraArtworksQueryArgs } from './types';

import {
  GET_HASURA_USER_ARTWORKS,
  HASURA_ARTWORKS_QUERY,
} from 'queries/hasura/artworks';

import { isEmptyOrNil } from 'utils/helpers';
import { maybeGetAddress } from 'utils/users';
import { filterNonUserStatuses } from 'utils/moderation';

interface ArtworkData {
  artworks: Artwork[];
}

interface UseBatchServerArtworksArgs
  extends HasuraArtworksQueryArgs,
    QueryFunctionOptions {}

export default function useBatchServerArtworks({
  tokenIds,
  pollInterval,
  excludeHidden = true,
  moderationStatuses = [ModerationStatus.Active],
}: UseBatchServerArtworksArgs): QueryResult<ArtworkData> {
  return useQuery<ArtworkData, HasuraArtworksQueryArgs>(HASURA_ARTWORKS_QUERY, {
    variables: {
      tokenIds,
      excludeHidden,
      moderationStatuses,
      userModerationStatuses: filterNonUserStatuses(moderationStatuses),
    },
    skip: isEmptyOrNil(tokenIds),
    context: { endpoint: 'hasura' },
    pollInterval,
  });
}

export function useBidActivityArtworks(
  args: UseBatchServerArtworksArgs
): QueryResult<ArtworkData> {
  return useBatchServerArtworks({
    ...args,
    moderationStatuses: [
      ModerationStatus.Active,
      ModerationStatus.UnderReview,
      ModerationStatus.Suspended,
    ],
  });
}

interface ArtworksByPublicKeyData {
  user: Account;
}

interface ArtworkBatchPublicKeyArgs extends QueryHookOptions {
  publicKey: string;
}

export function useBatchServerArtworksByPublicKey({
  publicKey,
  pollInterval,
}: ArtworkBatchPublicKeyArgs): QueryResult<ArtworksByPublicKeyData> {
  return useQuery<ArtworksByPublicKeyData, ArtworkBatchPublicKeyArgs>(
    GET_HASURA_USER_ARTWORKS,
    {
      variables: { publicKey: maybeGetAddress(publicKey) },
      skip: isEmptyOrNil(publicKey),
      context: { endpoint: 'hasura' },
      pollInterval,
    }
  );
}

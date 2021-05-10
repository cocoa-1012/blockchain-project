import { any, find } from 'ramda';
import { useQuery } from 'react-query';

import { isFlaggedForModeration } from 'utils/moderation';
import ModerationStatus from 'types/ModerationStatus';

import { getUserFlaggedArtworks } from 'queries/hasura/moderation';

interface UserModerationState {
  isLoading: boolean;
  isUserOrArtworkModerated: boolean;
  isUserModerated: boolean;
  isArtworkModerated: boolean;
  moderationStatus: ModerationStatus;
}

export default function useUserModerationState(
  publicAddress: string
): UserModerationState {
  const { data: userData, isLoading: userLoading } = useQuery(
    ['getHasuraUserArtworkStatuses', publicAddress],
    () => getUserFlaggedArtworks(publicAddress),
    { enabled: Boolean(publicAddress) }
  );

  const user = userData?.user;
  const userArtworks = user?.artworks ?? [];

  const moderatedArtwork = find(
    (artwork) => isFlaggedForModeration(artwork.moderationStatus),
    userArtworks
  );

  const hasModeratedArtwork = any(
    (artwork) => isFlaggedForModeration(artwork.moderationStatus),
    userArtworks
  );

  const isCreatorModerated = isFlaggedForModeration(user?.moderationStatus);

  const moderationStatus = isCreatorModerated
    ? user?.moderationStatus
    : moderatedArtwork?.moderationStatus;

  return {
    isLoading: userLoading,
    isUserOrArtworkModerated: isCreatorModerated || hasModeratedArtwork,
    isUserModerated: isCreatorModerated,
    isArtworkModerated: hasModeratedArtwork,
    moderationStatus,
  };
}

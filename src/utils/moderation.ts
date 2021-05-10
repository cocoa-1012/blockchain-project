import Artwork from 'types/Artwork';
import ModerationStatus from 'types/ModerationStatus';

export const isFlaggedForModeration = (status: ModerationStatus): boolean =>
  [
    ModerationStatus.Suspended,
    ModerationStatus.UnderReview,
    ModerationStatus.TakedownRequested,
  ].includes(status);

export const filterNonUserStatuses = (
  statuses: ModerationStatus[]
): ModerationStatus[] =>
  statuses.filter((status) => status !== ModerationStatus.TakedownRequested);

interface ArtworkOrCreatorModerated {
  moderationStatus: ModerationStatus;
  isModerated: boolean;
}

export const isArtworkOrCreatorModerated = (
  artwork: Artwork
): ArtworkOrCreatorModerated => {
  const artworkModerationStatus = artwork?.moderationStatus;
  const userModerationStatus = artwork?.creator?.moderationStatus;

  const isArtworkModerated = isFlaggedForModeration(artworkModerationStatus);

  const isCreatorModerated = isFlaggedForModeration(userModerationStatus);

  const moderationStatus = isCreatorModerated
    ? userModerationStatus
    : artworkModerationStatus;

  return {
    moderationStatus,
    isModerated: isArtworkModerated || isCreatorModerated,
  };
};

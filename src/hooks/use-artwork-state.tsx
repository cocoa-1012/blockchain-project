import { compose } from 'ramda';
import Artwork from 'types/Artwork';
import { ArtworkAndOwnerStatus } from 'types/artwork/artwork';
import { getArtworkAndOwnerStatus } from 'utils/artwork/artwork';
import { getArtworkHistory, filterMigrationHistoryEvents } from 'utils/history';

interface UseArtworkStateProps {
  artwork: Artwork;
  isOwner: boolean;
}

export default function useArtworkState({
  artwork,
  isOwner,
}: UseArtworkStateProps): ArtworkAndOwnerStatus {
  const artworkHistory = compose(
    filterMigrationHistoryEvents,
    getArtworkHistory
  )(artwork);

  const latestEvent = artworkHistory?.[0]?.event;

  return getArtworkAndOwnerStatus({
    event: latestEvent,
    isOwner: isOwner,
  });
}

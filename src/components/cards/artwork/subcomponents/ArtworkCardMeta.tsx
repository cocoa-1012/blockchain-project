import { always, cond, equals, T } from 'ramda';

import { ComputedArtworkStatus } from 'types/artwork/artwork';
import { ArtworkCardMetaProps } from './meta/types';

import ArtworkMetaListed from './meta/ArtworkMetaListed';
import ArtworkMetaLiveAuction from './meta/ArtworkMetaLiveAuction';
import ArtworkMetaSettled from './meta/ArtworkMetaSettled';
import ArtworkMetaTransferred from './meta/ArtworkMetaTransferred';
import ArtworkMetaUnsettled from './meta/ArtworkMetaUnsettled';
import ArtworkCardMetaMinted from './meta/ArtworkCardMetaMinted';

export default function ArtworkCardMeta(
  props: ArtworkCardMetaProps
): JSX.Element {
  const { status, mostRecentActiveAuction, artwork, isOwnerOnProfile } = props;

  return cond<ComputedArtworkStatus, JSX.Element>([
    [equals(ComputedArtworkStatus.Burned), always(null)],
    [
      equals(ComputedArtworkStatus.Minted),
      always(
        <ArtworkCardMetaMinted
          artwork={artwork}
          auction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
        />
      ),
    ],
    [
      equals(ComputedArtworkStatus.Listed),
      always(
        <ArtworkMetaListed
          artwork={artwork}
          auction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
        />
      ),
    ],
    [
      equals(ComputedArtworkStatus.ListedButNotByMe),
      always(
        <ArtworkMetaListed
          artwork={artwork}
          auction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
        />
      ),
    ],
    [
      equals(ComputedArtworkStatus.LiveAuction),
      always(
        <ArtworkMetaLiveAuction
          artwork={artwork}
          auction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
        />
      ),
    ],
    [
      equals(ComputedArtworkStatus.Unsettled),
      always(
        <ArtworkMetaUnsettled
          artwork={artwork}
          auction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
        />
      ),
    ],
    [
      equals(ComputedArtworkStatus.Settled),
      always(
        <ArtworkMetaSettled
          artwork={artwork}
          auction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
        />
      ),
    ],
    [
      equals(ComputedArtworkStatus.Transferred),
      always(
        <ArtworkMetaTransferred
          artwork={artwork}
          auction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
        />
      ),
    ],
    [T, always(null)],
  ])(status);
}

/* eslint-disable react/jsx-max-depth */
import FollowPopover from 'components/follows/FollowPopover';
import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel, {
  ArtworkCardMetaValue,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import ArtworkCardOwnerTag from 'components/cards/artwork/subcomponents/ArtworkCardOwnerTag';
import ArtworkCardMetaRelistButton from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaListButton';

import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';

import { buildUserProfilePath } from 'utils/artwork/artwork';
import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaTransferred(
  props: ArtworkMetaProps
): JSX.Element {
  const { artwork, isOwnerOnProfile, auction } = props;

  const profilePath = buildUserProfilePath({ user: artwork?.owner });

  if (!isOwnerOnProfile && auction) {
    return (
      <ArtworkCardMetaContainer>
        <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
          <ArtworkCardMetaLabel color="light">
            Last sold for
          </ArtworkCardMetaLabel>
          <ArtworkCardMetaValue color="light">
            {formatETHWithSuffix(auction?.highestBidAmount)}
          </ArtworkCardMetaValue>
        </ArtworkCardMetaBlock>

        <ArtworkCardMetaBlock css={{ marginLeft: '$7' }}>
          <ArtworkCardMetaLabel color="light" css={{ textAlign: 'right' }}>
            Owned by
          </ArtworkCardMetaLabel>
          <TopSurfaceBox>
            <FollowPopover publicKey={artwork?.owner?.publicKey}>
              <ArtworkCardOwnerTag href={profilePath} user={artwork?.owner} />
            </FollowPopover>
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      </ArtworkCardMetaContainer>
    );
  }

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock>
        <ArtworkCardMetaLabel color="light">Owned by</ArtworkCardMetaLabel>
        <TopSurfaceBox>
          <FollowPopover publicKey={artwork?.owner?.publicKey}>
            <ArtworkCardOwnerTag href={profilePath} user={artwork?.owner} />
          </FollowPopover>
        </TopSurfaceBox>
      </ArtworkCardMetaBlock>

      {isOwnerOnProfile && (
        <ArtworkCardMetaBlock css={{ marginLeft: '$7', flexGrow: 1 }}>
          <TopSurfaceBox>
            <ArtworkCardMetaRelistButton artwork={artwork} />
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      )}
    </ArtworkCardMetaContainer>
  );
}

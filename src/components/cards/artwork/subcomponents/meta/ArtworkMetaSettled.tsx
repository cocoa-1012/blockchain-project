import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel, {
  ArtworkCardMetaValue,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import ArtworkCardOwnerTag from 'components/cards/artwork/subcomponents/ArtworkCardOwnerTag';
import ArtworkCardMetaListButton from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaListButton';

import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';
import FollowPopover from 'components/follows/FollowPopover';

import { formatETHWithSuffix } from 'utils/formatters';
import { buildUserProfilePath } from 'utils/artwork/artwork';

export default function ArtworkMetaSettled(
  props: ArtworkMetaProps
): JSX.Element {
  const { auction, artwork, isOwnerOnProfile } = props;

  const profilePath = buildUserProfilePath({
    user: auction?.highestBidderUser,
  });

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
        <ArtworkCardMetaLabel color="light">Last sold for</ArtworkCardMetaLabel>
        <ArtworkCardMetaValue color="light">
          {formatETHWithSuffix(auction?.highestBidAmount)}
        </ArtworkCardMetaValue>
      </ArtworkCardMetaBlock>

      {isOwnerOnProfile ? (
        <TopSurfaceBox css={{ marginLeft: '$7', flex: 1 }}>
          <ArtworkCardMetaListButton artwork={artwork} isSecondary />
        </TopSurfaceBox>
      ) : (
        <ArtworkCardMetaBlock css={{ marginLeft: '$7' }}>
          <ArtworkCardMetaLabel color="light" css={{ textAlign: 'right' }}>
            Owned by
          </ArtworkCardMetaLabel>
          <TopSurfaceBox>
            <FollowPopover publicKey={auction?.highestBidder}>
              <ArtworkCardOwnerTag
                href={profilePath}
                user={auction?.highestBidderUser}
              />
            </FollowPopover>
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      )}
    </ArtworkCardMetaContainer>
  );
}

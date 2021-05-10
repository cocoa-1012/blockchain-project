import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel, {
  ArtworkCardMetaValue,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import ArtworkCardOwnerTag from '../ArtworkCardOwnerTag';

import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';
import FollowPopover from 'components/follows/FollowPopover';
import { buildUserProfilePath } from 'utils/artwork/artwork';

import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaListed(
  props: ArtworkMetaProps
): JSX.Element {
  const { auction, artwork } = props;

  const isSecondarySale = auction?.isPrimarySale === false;

  const profilePath = buildUserProfilePath({
    user: artwork?.owner,
  });

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
        <ArtworkCardMetaLabel>Reserve price</ArtworkCardMetaLabel>
        <ArtworkCardMetaValue>
          {formatETHWithSuffix(auction?.reservePriceInETH)}
        </ArtworkCardMetaValue>
      </ArtworkCardMetaBlock>

      {isSecondarySale && (
        <ArtworkCardMetaBlock css={{ marginLeft: '$7' }}>
          <ArtworkCardMetaLabel color="light" css={{ textAlign: 'right' }}>
            Listed by
          </ArtworkCardMetaLabel>
          <TopSurfaceBox>
            <FollowPopover publicKey={artwork?.ownerPublicKey}>
              <ArtworkCardOwnerTag href={profilePath} user={artwork?.owner} />
            </FollowPopover>
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      )}
    </ArtworkCardMetaContainer>
  );
}

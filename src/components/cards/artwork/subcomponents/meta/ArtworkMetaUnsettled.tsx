import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel, {
  ArtworkCardMetaValue,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import ArtworkCardMetaSettleButton from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaSettleButton';

import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';

import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaUnsettled(
  props: ArtworkMetaProps
): JSX.Element {
  const { auction, artwork, isOwnerOnProfile } = props;

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
        <ArtworkCardMetaLabel color="light">Last sold for</ArtworkCardMetaLabel>
        <ArtworkCardMetaValue color="light">
          {formatETHWithSuffix(auction?.highestBidAmount)}
        </ArtworkCardMetaValue>
      </ArtworkCardMetaBlock>

      {isOwnerOnProfile && (
        <TopSurfaceBox css={{ marginLeft: '$7', flex: 1 }}>
          <ArtworkCardMetaSettleButton artwork={artwork} />
        </TopSurfaceBox>
      )}
    </ArtworkCardMetaContainer>
  );
}

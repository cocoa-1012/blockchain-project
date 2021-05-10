import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaListButton from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaListButton';
import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';

import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';
import ArtworkCardMetaLabel, {
  ArtworkCardMetaValue,
} from './ArtworkCardMetaLabel';

import { timeAgoInWords } from 'utils/dates/dates';

export default function ArtworkCardMetaMinted(
  props: ArtworkMetaProps
): JSX.Element {
  const { artwork, isOwnerOnProfile } = props;

  if (isOwnerOnProfile) {
    return (
      <ArtworkCardMetaContainer>
        <TopSurfaceBox css={{ display: 'block', flex: 1 }}>
          <ArtworkCardMetaListButton artwork={artwork} />
        </TopSurfaceBox>
      </ArtworkCardMetaContainer>
    );
  }

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
        <ArtworkCardMetaLabel color="light">Minted</ArtworkCardMetaLabel>
        <ArtworkCardMetaValue color="light">
          {timeAgoInWords(artwork?.latestTxDate)}
        </ArtworkCardMetaValue>
      </ArtworkCardMetaBlock>
    </ArtworkCardMetaContainer>
  );
}

import ArtworkCardMetaButton from './ArtworkCardMetaButton';

import { buildArtworkPath } from 'utils/artwork/artwork';

import { ArtworkMetaProps } from './types';

export default function ArtworkCardMetaSettleButton(
  props: Pick<ArtworkMetaProps, 'artwork'>
): JSX.Element {
  const { artwork } = props;

  const artworkPath = buildArtworkPath({ artwork, user: artwork.creator });

  return (
    <ArtworkCardMetaButton href={`${artworkPath}/settle`}>
      Settle
    </ArtworkCardMetaButton>
  );
}

import ArtworkCardMetaButton from './ArtworkCardMetaButton';

import {
  buildArtworkPath,
  buildCreatorArtworkPath,
} from 'utils/artwork/artwork';

import { ArtworkMetaProps } from './types';

type ArtworkCardMetaListButtonProps = Pick<ArtworkMetaProps, 'artwork'> & {
  isSecondary?: boolean;
};

export default function ArtworkCardMetaListButton(
  props: ArtworkCardMetaListButtonProps
): JSX.Element {
  const { artwork, isSecondary } = props;

  const secondaryPath = buildArtworkPath({ artwork, user: artwork.creator });
  const primaryPath = buildCreatorArtworkPath(artwork);
  const listPath = isSecondary ? secondaryPath : primaryPath;

  return (
    <ArtworkCardMetaButton href={`${listPath}/list`}>
      List
    </ArtworkCardMetaButton>
  );
}

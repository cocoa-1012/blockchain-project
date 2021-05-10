import Text from 'components/base/Text';
import { styled } from 'stitches.config';

const ArtworkCardMetaLabel = styled(Text, {
  fontSize: '$1',
  fontWeight: 600,
  fontFamily: '$body',
  variants: {
    color: {
      light: {
        color: '$black60',
      },
      white: {
        color: '$white100',
      },
    },
  },
});

export const ArtworkCardMetaValue = styled(ArtworkCardMetaLabel, {
  fontSize: '$2',
});

export default ArtworkCardMetaLabel;

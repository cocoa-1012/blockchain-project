import { styled } from 'stitches.config';
import Text from 'components/base/Text';

const TrendingName = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
  letterSpacing: -0.2,
  marginBottom: '$1',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@bp2': {
    fontSize: '$3',
  },
});

export default TrendingName;

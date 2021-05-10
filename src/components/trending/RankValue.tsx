import { styled } from 'stitches.config';
import Text from 'components/base/Text';

const RankValue = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  color: '$black60',
  fontSize: '$1',
  paddingLeft: 0,
  '@bp2': {
    fontSize: '$2',
  },
  '@bp4': { paddingLeft: '$3' },
});

export default RankValue;

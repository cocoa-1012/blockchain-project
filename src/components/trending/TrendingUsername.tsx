import { styled } from 'stitches.config';
import Text from 'components/base/Text';

const TrendingUsername = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  variants: {
    hasNoUsername: {
      true: {
        fontFamily: '$mono',
        fontWeight: 400,
        fontSize: '$0',
        color: '$black100',
      },
    },
    hasNoName: {
      true: {
        fontSize: '$1',
        '@bp2': {
          fontSize: '$3',
        },
      },
    },
  },
  compoundVariants: [
    {
      hasNoUsername: true,
      hasNoName: true,
      css: {
        fontSize: '$0',
        '@bp2': {
          fontSize: '$2',
        },
      },
    },
  ],
});

export default TrendingUsername;

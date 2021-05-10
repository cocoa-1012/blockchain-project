import { styled } from 'stitches.config';
import Text from './Text';

const Paragraph = styled(Text, {
  fontFamily: '$body',
  lineHeight: '$body',
  fontSize: '$1',

  variants: {
    size: {
      sub: {
        fontSize: '$0',
      },
      regular: {
        fontSize: '$1',
      },
    },
  },
});

export default Paragraph;

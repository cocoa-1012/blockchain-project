import Box from 'components/base/Box';
import { styled } from 'stitches.config';

const FieldHint = styled(Box, {
  fontFamily: '$body',
  fontSize: '$0',
  paddingY: '$2',
  paddingX: '$3',
  borderRadius: '$1',

  variants: {
    type: {
      warning: {
        backgroundColor: '$red10',
        color: '$red100',
      },
    },
  },
});

export default FieldHint;

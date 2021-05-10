import { styled } from 'stitches.config';
import Box from 'components/base/Box';

const Flex = styled(Box, {
  display: 'flex',
  variants: {
    center: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
});

export default Flex;

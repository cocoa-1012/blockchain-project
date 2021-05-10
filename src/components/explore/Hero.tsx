import Flex from 'components/base/Flex';
import { styled } from 'stitches.config';

const Hero = styled(Flex, {
  justifyContent: 'center',
  textAlign: 'center',
  marginY: '$5',
  '@bp1': {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});

export default Hero;

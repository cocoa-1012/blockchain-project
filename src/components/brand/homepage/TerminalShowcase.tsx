import { styled } from 'stitches.config';
import Flex from 'components/base/Flex';

const TerminalShowcase = styled(Flex, {
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: '$7',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: 380,
  zIndex: 1,
  position: 'relative',
  '@bp1': {
    marginBottom: '$8',
    minHeight: 800,
    textAlign: 'left',
    alignItems: 'flex-start',
  },
});

export default TerminalShowcase;

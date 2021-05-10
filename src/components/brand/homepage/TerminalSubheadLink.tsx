import { styled } from 'stitches.config';
import TerminalSubhead from './TerminalSubhead';

const TerminalSubheadLink = styled(TerminalSubhead, {
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '@bp1': {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
});

export default TerminalSubheadLink;

import { styled } from 'stitches.config';

const TerminalSubhead = styled('h4', {
  fontFamily: '$body',
  fontSize: '$2',
  letterSpacing: '-0.5px',
  lineHeight: 1.2,
  marginY: '$3',
  '@bp1': {
    fontSize: '$4',
    marginY: '$6',
  },
});

export default TerminalSubhead;

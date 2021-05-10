import { styled } from 'stitches.config';

const Subhead = styled('h4', {
  fontFamily: '$body',
  fontSize: '$3',
  marginY: '$3',
  '@bp1': {
    fontSize: '$4',
    marginY: '$6',
  },
});

export default Subhead;

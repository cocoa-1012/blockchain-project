import { styled } from 'stitches.config';

const Heading = styled('h1', {
  fontFamily: '$display',
  fontSize: '$5',
  textTransform: 'uppercase',
  lineHeight: 0.9,
  letterSpacing: -0.5,
  '@media(min-width: 600px)': {
    fontSize: '$9',
    letterSpacing: -0.3,
  },
  '@media(min-width: 960px)': {
    fontSize: 146,
  },
});

export default Heading;

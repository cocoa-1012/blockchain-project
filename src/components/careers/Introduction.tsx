import { styled } from 'stitches.config';

const Introduction = styled('h2', {
  marginX: 'auto',
  marginBottom: '$9',
  lineHeight: 1.3,
  fontFamily: '$body',
  fontSize: '$3',
  textAlign: 'center',
  maxWidth: 960,
  '@bp1': { fontSize: '$4' },
});

export default Introduction;

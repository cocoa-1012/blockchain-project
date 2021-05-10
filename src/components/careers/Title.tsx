import { styled } from 'stitches.config';

const Title = styled('h3', {
  fontFamily: '$body',
  lineHeight: 1.3,
  letterSpacing: '-0.5',
  fontSize: '$4',
  fontWeight: 600,
  marginBottom: '$6',
  '@bp1': {
    fontSize: '$5',
    marginBottom: '$9'
  },
});

export default Title;

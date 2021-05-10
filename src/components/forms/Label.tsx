import { styled } from 'stitches.config';

const Label = styled('label', {
  fontSize: '$2',
  cursor: 'pointer',
  fontWeight: 600,
  letterSpacing: '-0.2px',
  '@bp1': {
    fontSize: '$3',
  },
});

export default Label;

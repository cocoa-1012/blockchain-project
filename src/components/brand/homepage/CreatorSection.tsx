import { styled } from 'stitches.config';
import Grid from 'components/base/Grid';

const CreatorSection = styled(Grid, {
  gridGap: '20px',
  marginTop: '$3',
  marginBottom: '$9',
  justifyContent: 'center',
  zIndex: 1,
  position: 'relative',
  '@bp1': {
    gridTemplateColumns: '1fr 1fr',
    marginY: '$9',
  },
});

export default CreatorSection;

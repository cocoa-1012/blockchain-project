import { styled } from 'stitches.config';
import Grid from 'components/base/Grid';

const Section = styled(Grid, {
  maxWidth: 960,
  margin: 'auto',
  marginTop: 860,
  '@media(min-width: 500px)': {
    marginTop: 440,
  },
  '@media(min-width: 2000px)': {
    marginTop: 500,
  },
  '@bp2': {
    gridTemplateColumns: '1fr 1fr',
  },
});

export default Section;

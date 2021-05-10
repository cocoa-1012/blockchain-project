import { styled } from 'stitches.config';
import Grid from 'components/base/Grid';

const ModuleWrapper = styled(Grid, {
  maxWidth: 960,
  margin: 'auto',
  gridGap: '$8',
  marginBottom: '$10',
  '@bp0': {
    marginBottom: 180,
    gridTemplateColumns: '1fr 1fr',
  },
});

export default ModuleWrapper;

import { styled } from 'stitches.config';
import Grid from 'components/base/Grid';

const HiringHeader = styled(Grid, {
  alignItems: 'flex-end',
  marginY: '$7',
  zIndex: 1,
  position: 'relative',
  '@bp1': {
    gridTemplateColumns: '1fr 1fr',
    marginY: '$8',
  },
});

export default HiringHeader;

import Grid from 'components/base/Grid';
import { styled } from 'stitches.config';

const TextSection = styled(Grid, {
  marginY: '$7',
  gridGap: '$7',
  zIndex: 1,
  position: 'relative',

  '@bp1': {
    gridTemplateColumns: '1fr 1fr',
    marginY: '$9',
    gridColumnGap: '$11',
    gridRowGap: '$9',
  },
  variants: {
    textAlign: {
      mobileCenter: {
        textAlign: 'center',
        '@bp1': {
          textAlign: 'left',
        },
      },
    },
  },
});

export default TextSection;

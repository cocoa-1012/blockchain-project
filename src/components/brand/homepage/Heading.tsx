import { styled } from 'stitches.config';

const Heading = styled('h2', {
  fontFamily: '$display',
  fontSize: '$5',
  textTransform: 'uppercase',
  lineHeight: 0.9,
  zIndex: 1,
  position: 'relative',
  '@bp1': {
    fontSize: '$13',
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

export default Heading;

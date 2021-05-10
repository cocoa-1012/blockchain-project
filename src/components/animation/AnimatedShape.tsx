import { styled, keyframes } from 'stitches.config';

const floating = keyframes({
  '0%': {
    transform: 'translate(10px, 20px)',
  },

  '10%': {
    transform: 'translate(-10px, 10px) rotate(-2deg)',
  },

  '50%': {
    transform: 'translate(20px, 20px)',
  },

  '70%': {
    transform: 'translate(-10px, 10px) rotate(-2deg)',
  },

  '100%': {
    transform: 'translate(10px, 20px)',
  },
});

export const floatingRevert = keyframes({
  '0%': {
    transform: 'translate(-10px, -20px)',
  },

  '10%': {
    transform: 'translate(10px, -10px) rotate(2deg)',
  },

  '50%': {
    transform: 'translate(-20px, -20px)',
  },

  '70%': {
    transform: 'translate(10px, -10px) rotate(2deg)',
  },

  '100%': {
    transform: 'translate(-10px, -20px)',
  },
});

const AnimatedShape = styled('img', {
  animation: `${floating} 25s ease-in-out infinite`,
  transformOrigin: 'center',
  width: 150,
  '@bp2': {
    width: 200,
  },
  '@bp3': {
    width: 400,
  },
  alignSelf: 'flex-end',

  variants: {
    animation: {
      reverted: {
        animation: `${floatingRevert} 25s ease-in-out infinite`,
      },
    },
  },
});

export default AnimatedShape;

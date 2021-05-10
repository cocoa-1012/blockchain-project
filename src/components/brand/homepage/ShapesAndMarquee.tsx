import { styled, keyframes } from 'stitches.config';
import Box from 'components/base/Box';
import Image from 'components/base/Image';

export const MarqueeContainer = styled('section', {
  position: 'absolute',
  left: 0,
  right: 0,
  overflow: 'hidden',
  zIndex: 1,
  pointerEvents: 'none',
});

export const marquee = keyframes({
  '0%': {
    transform: 'translate3d(calc(-10% + 10vw), 0, 0)',
  },
  '100%': {
    transform: 'translate3d(calc(-20% + 10vw), 0, 0)',
  },
});

export const MarqueeWrapper = styled(Box, {
  width: 'fit-content',
  display: 'flex',
  position: 'relative',
  transform: 'translate3d(calc(10% + 10vw), 0, 0)',
  animation: `${marquee} 50s linear infinite`,
  animationFillMode: 'forwards',
  '@supports (-webkit-touch-callout: none)': {
    '-webkit-text-fill-color': '$colors$blue100',
  },
});

export const HeadingWrapper = styled(Box, {
  whiteSpace: 'nowrap',
  marginX: '$1',
  '@bp1': {
    marginX: '$5',
  },
});

const Container = styled(Box, {
  position: 'absolute',
  left: 0,
  right: 0,
});

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

const floatingRevert = keyframes({
  '0%': {
    transform: 'translate(-10px, -20px)',
  },

  '10%': {
    transform: 'translate(10px, -10px) rotate(-2deg)',
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

const ShapesContainer = styled('div', {
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  bottom: '50%',
  right: '50%',
  transform: 'translate(50%, 50%)',
  width: 300,

  '@bp1': {
    bottom: '60%',
    right: '5%',
    transform: 'translate(5%, 60%)',
  },

  '@bp3': {
    width: 610,
  },

  '@media(min-width: 2200px)': {
    bottom: '60%',
    right: '30%',
    transform: 'translate(30%, 60%)',
  },
});

const Shape = styled('img', {
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

  '&:nth-of-type(2)': {
    animation: `${floatingRevert} 15s ease-in-out infinite`,
    alignSelf: 'flex-start',
    backdropFilter: 'blur(1px)',
    borderRadius: '$round',
  },
});

function Shapes(): JSX.Element {
  return (
    <ShapesContainer>
      <Shape src="/images/shapes/prism.png" alt="prism" />
      <Shape src="/images/shapes/sphere.png" alt="sphere" />
      <Shape src="/images/shapes/cube.png" alt="cube" />
    </ShapesContainer>
  );
}

export default function ShapesAndMarquee(): JSX.Element {
  const array = Array.from(Array(10).keys());
  return (
    <Container>
      <Shapes />
      <MarqueeContainer>
        <MarqueeWrapper>
          {array.map((index) => (
            <HeadingWrapper key={index}>
              <Image
                src="/images/svg-text/the-new-creative-economy.svg"
                alt="The new creative economy"
                css={{
                  maxWidth: 'unset',
                  width: '180vw',
                  '@bp1': {
                    width: 'unset',
                  },
                }}
              />
            </HeadingWrapper>
          ))}
        </MarqueeWrapper>
      </MarqueeContainer>
    </Container>
  );
}

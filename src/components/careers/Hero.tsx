import { styled } from 'stitches.config';
import Flex from 'components/base/Flex';
import Image from 'components/base/Image';
import Picture from 'components/base/Picture';

const Wrapper = styled(Flex, {
  alignItems: 'center',
  position: 'relative',
  flexDirection: 'column',
  '@bp1': {
    flexDirection: 'row',
  },
  '&:after': {
    content: '',
    position: 'absolute',
    width: '100vw',
    height: '100%',
    top: '0',
    right: 0,
    left: 0,
    zIndex: -1,
    backgroundColor: '#0101ff',
    transform: 'scaleX(1.5)',
  },
});

const ShapeColumn = styled(Picture, {
  width: '100%',
  '@bp1': {
    img: {
      maxHeight: 890,
      maxWidth: '100%',
      objectFit: 'contain',
    },

    textAlign: 'left',
    '&:nth-of-type(2)': {
      textAlign: 'right',
    },
  },

  '&:nth-of-type(2)': {
    '@media(max-width: 800px)': {
      marginTop: '-30%',
    },
  },
});

const Title = styled('h1', {
  '@media (min-width: 800px)': {
    marginX: '$7',
    paddingY: '$7',
  },
  img: {
    maxWidth: 300,
    '@media (min-width: 800px)': {
      minWidth: 400,
      maxWidth: 800,
    },
    '@media(max-width: 1200px)': {
      width: '100%',
    },
  },
});

export default function Hero(): JSX.Element {
  return (
    <Wrapper>
      <ShapeColumn>
        <source
          srcSet="/images/careers/hero-left-column.png"
          media="(min-width: 832px)"
        />
        <img src="/images/careers/hero-top-row.png" alt="" />
      </ShapeColumn>
      <Title>
        <picture>
          <source
            srcSet="/images/careers/build-the-future-with-us.png"
            media="(min-width: 832px)"
          />
          <img
            src="/images/careers/build-the-future-with-us-mobile.png"
            alt="Build the future with us"
          />
        </picture>
      </Title>
      <ShapeColumn>
        <source
          srcSet="/images/careers/hero-right-column.png"
          media="(min-width: 832px)"
        />
        <img src="/images/careers/hero-bottom-row.png" alt="" />
      </ShapeColumn>
      <Image
        src="/images/icons/down-arrow.svg"
        alt="Down"
        css={{
          display: 'none',
          '@bp4': {
            display: 'block',
            position: 'absolute',
            left: '50%',
            bottom: 20,
            width: 16,
            height: 22,
            transform: 'translateX(-50%)',
          },
        }}
      />
    </Wrapper>
  );
}

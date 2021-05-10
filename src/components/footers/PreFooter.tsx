/* eslint-disable react/jsx-max-depth */
import Body from 'components/base/Body';
import Button from 'components/base/Button';
import Link from 'components/links/Link';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import AnimatedShape from 'components/animation/AnimatedShape';
import { styled } from 'stitches.config';

const Shape = styled(AnimatedShape, {
  width: 360,
});

export default function PreFooter(): JSX.Element {
  return (
    <Box
      css={{
        paddingY: '$9',
        background: '$black95',
        '@bp1': {
          paddingY: 152,
          overflowX: 'clip',
        },
      }}
    >
      <Body
        css={{
          '@bp1': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        <Grid
          css={{
            maxWidth: 880,
            marginX: 'auto',
            gridRowGap: '$6',
            textAlign: 'center',
            '@bp1': {
              gridRowGap: '$8',
            },
          }}
        >
          <Box
            css={{
              display: 'none',
              '@bp3': {
                display: 'flex',
                position: 'absolute',
                left: '-2%',
                top: '-50%',
                bottom: '-17%',
                zIndex: -1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
            }}
          >
            <Shape src="/images/shapes/prism.png" alt="prism" />
            <Shape src="/images/shapes/neocube.png" alt="cube" />
          </Box>
          <picture>
            <source
              srcSet="/images/svg-text/this-is-the-new-creative-economy.svg"
              media="(min-width: 800px)"
            />
            <img
              src="/images/svg-text/this-is-the-new-creative-economy-mobile.svg"
              alt="This is the new creative economy."
              style={{ minWidth: 284 }}
            />
          </picture>
          <Text
            css={{
              fontFamily: '$body',
              color: '$black40',
              letterSpacing: -0.2,
              fontSize: '$3',
              textAlign: 'center',
              lineHeight: 1.3,
              maxWidth: 428,
              marginX: 'auto',
            }}
          >
            We’re bringing digital creators, crypto natives, and collectors
            together to move culture forward.
          </Text>
          <Button
            color="blue"
            shape="round"
            size="large"
            css={{ width: 230, margin: 'auto', fontSize: '$2' }}
          >
            <Link href="/explore">
              <a
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                Explore Foundation
              </a>
            </Link>
          </Button>
          <Box
            css={{
              display: 'none',
              '@bp3': {
                display: 'flex',
                position: 'absolute',
                right: '-2%',
                top: '-50%',
                bottom: '-25%',
                zIndex: -1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
            }}
          >
            <Shape src="/images/shapes/sphere.png" alt="sphere" />
            <Shape src="/images/shapes/cube.png" alt="cube" />
          </Box>
        </Grid>
      </Body>
    </Box>
  );
}

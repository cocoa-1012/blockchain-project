import { styled } from 'stitches.config';

import Text from './Text';

function HeadingText(props): JSX.Element {
  return <Text as="h1" {...props} />;
}

const Heading = styled(HeadingText, {
  fontFamily: '$body',
  fontWeight: 600,

  variants: {
    tracking: {
      tight: {
        letterSpacing: '-0.02em',
      },
    },
    leading: {
      tight: {
        lineHeight: 1.11,
      },
    },
  },
});

export default Heading;

import { styled } from 'stitches.config';
import Link from 'components/brand/homepage/Link';

const HeadingLink = styled(Link, {
  fontSize: '$2',
  letterSpacing: '-0.5px',
  justifySelf: 'left',
  zIndex: 1,
  position: 'relative',
  '@bp1': {
    justifySelf: 'right',
    fontSize: '$4',
  },
});

export default HeadingLink;

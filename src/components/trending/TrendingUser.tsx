import Flex from 'components/base/Flex';
import { styled } from 'stitches.config';

const TrendingUser = styled(Flex, {
  cursor: 'pointer',
  fontFamily: '$body',
  backgroundColor: '$white100',
  justifyContent: 'space-between',
  borderRadius: '$1',
  boxShadow: '$0',
  color: '$black100',
  paddingX: '$3',
  paddingY: '$4',
  textDecoration: 'none',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  marginBottom: '$3',
  height: 80,
  '@bp1': {
    height: 105,
    paddingX: '$5',
    paddingY: '$6',
  },
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: '$1',
      transform: 'translateY(-2px)',
    },
  },
});

export default TrendingUser;

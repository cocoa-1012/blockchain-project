import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';

const UserTagContainer = styled(Flex, {
  alignItems: 'center',
  boxShadow: '$0',
  height: 52,
  paddingLeft: 10,
  paddingRight: '$5',
  borderRadius: '$round',
  willChange: 'transform',
  transition: 'box-shadow $1 $ease, transform $1 $ease',
  variants: {
    hoverable: {
      true: {
        '@media (hover: hover)': {
          '&:hover': {
            boxShadow: '$1',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

export default UserTagContainer;

import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';

const TabBar = styled(Flex, {
  borderBottom: '1px solid $black10',
  marginBottom: 20,
  '@bp1': { marginBottom: '$3' },
  '@bp2': { marginBottom: '$4' },
});

export default TabBar;

import { styled } from 'stitches.config';

import Box from './base/Box';

const HoverableIcon = styled(Box, {
  color: '$black20',
  transition: 'color $0 $ease',
  '&:hover': {
    color: '$black100',
  },
});

export default HoverableIcon;

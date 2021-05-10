import { styled } from 'stitches.config';

import Box from 'components/base/Box';

const SearchBarOverlay = styled(Box, {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  zIndex: 990,
  backgroundColor: 'rgba(0,0,0,0.4)',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity $2 $ease',
  transform: 'translateZ(0)',
});

export default SearchBarOverlay;

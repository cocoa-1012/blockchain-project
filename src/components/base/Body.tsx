import { styled } from 'stitches.config';

import Box from './Box';

const Body = styled(Box, {
  maxWidth: '$container',
  marginLeft: 'auto',
  marginRight: 'auto',
  flexShrink: 0,
  flex: 1,
  flexGrow: 1,
  paddingX: '$6',
  width: '100%',
});

export default Body;

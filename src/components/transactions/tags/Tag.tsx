import { styled } from 'stitches.config';

const Tag = styled('div', {
  background: '$white100',
  fontFamily: '$body',
  boxShadow: '$0',
  borderRadius: '$1',
  paddingTop: '$1',
  paddingBottom: '$2',
  paddingX: '$3',
  margin: '$1',
  fontWeight: 600,
  maxWidth: 270,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

export default Tag;

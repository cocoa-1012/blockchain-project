import Box from 'components/base/Box';
import Text from 'components/base/Text';

import { styled, css } from 'stitches.config';

const pinnedLabelStyles = css({
  position: 'absolute',
  left: '$5',
  top: '$5',
})();

const Wrapper = styled(Box, {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 9999,
  paddingLeft: '$3',
  paddingRight: '$3',
  paddingTop: '$2',
  paddingBottom: '$2',
  color: '$white100',
  variants: {
    pinned: {
      true: { position: 'absolute', left: '$5', top: '$5' },
    },
  },
});

const Label = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$2',
  color: '$white100',
  marginLeft: '$1',
});

const ArtworkCardPill = {
  Wrapper,
  Label,
  pinnedLabelStyles,
};

export default ArtworkCardPill;

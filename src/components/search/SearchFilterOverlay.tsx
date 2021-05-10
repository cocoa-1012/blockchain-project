import Flex from 'components/base/Flex';

import { styled } from 'stitches.config';

export const FilterOverlayOuter = styled(Flex, {
  position: 'fixed',
  overflowX: 'hidden',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  overflowY: 'overlay',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 999,
  display: 'none',
  backgroundColor: '$white100',
  variants: {
    isOpen: {
      true: {
        display: 'flex',
      },
    },
  },
});

export const FilterOverlayInner = styled(Flex, {
  width: '100%',
  height: '100%',
  backgroundColor: '$white100',
  flexDirection: 'column',
});

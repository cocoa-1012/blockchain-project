import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import GraySquare from 'components/base/GraySquare';

const Container = styled(Flex, {
  alignItems: 'center',
  position: 'relative',
  borderRadius: '$2',
  paddingX: '$4',
  paddingY: '$6',
  minHeight: 106,
  backgroundColor: '$white100',
  '&:before': {
    content: '',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
    boxShadow: '$0',
    borderRadius: '$2',
  },
});

interface NotificationFollowSkeletonProps {
  css?: any;
}

export default function NotificationFollowSkeleton(
  props: NotificationFollowSkeletonProps
): JSX.Element {
  const { css } = props;

  return (
    <Container css={css}>
      <Box css={{ marginRight: '$3', position: 'relative' }}>
        <GraySquare css={{ width: 50, height: 50, borderRadius: 999 }} />
      </Box>
      <Box>
        <GraySquare css={{ width: 200, marginBottom: '$2' }} />
        <GraySquare css={{ height: 18 }} />
      </Box>
    </Container>
  );
}

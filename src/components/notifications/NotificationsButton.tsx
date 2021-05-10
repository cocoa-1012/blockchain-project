import { styled } from 'stitches.config';

import LightningIcon from 'assets/icons/lightning.svg';

import Box from 'components/base/Box';
import Button from 'components/base/Button';

const NotificationButtonAction = styled(Button, {
  backgroundColor: '$white100',
  position: 'relative',
  width: 34,
  height: 34,
  boxShadow: '$1',
  minHeight: 0,
  paddingLeft: 0,
  paddingRight: 0,
  cursor: 'pointer',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  borderRadius: '$round',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '$2',
  },
  '&:active': {
    transform: 'none',
    boxShadow: '$1',
  },
});

const NotifictionButtonStatus = styled(Box, {
  position: 'absolute',
  bottom: -2,
  right: -4,
  width: 18,
  height: 18,
  border: '4px solid $white100',
  backgroundColor: '$red100',
  borderRadius: '$round',
  zIndex: '2',
  display: 'none',
  variants: {
    hasUnread: {
      true: {
        display: 'block',
      },
    },
  },
});

interface NotificationsButtonProps {
  onClick: () => void;
  hasUnread: boolean;
}

export default function NotificationsButton(
  props: NotificationsButtonProps
): JSX.Element {
  const { onClick, hasUnread } = props;

  return (
    <NotificationButtonAction onClick={onClick}>
      <Box>
        <LightningIcon width={12} style={{ display: 'block' }} />
      </Box>
      <NotifictionButtonStatus hasUnread={hasUnread} />
    </NotificationButtonAction>
  );
}

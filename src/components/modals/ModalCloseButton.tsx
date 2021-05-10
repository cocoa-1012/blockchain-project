/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Button } from 'theme-ui';
import { useCallback } from 'react';

import CloseIcon from 'components/CloseIcon';

import { transitions } from 'utils/themes/main/theme';

import useModal from 'hooks/use-modal';

interface ModalCloseButtonProps {
  className?: string;
}

export default function ModalCloseButton(
  props: ModalCloseButtonProps
): JSX.Element {
  const { className } = props;

  const sx = getStyles();

  const { resetModal } = useModal();

  const onDismiss = useCallback(resetModal, [resetModal]);

  return (
    <Button
      variant="transparent"
      onClick={onDismiss}
      sx={sx.button}
      className={className}
    >
      <CloseIcon sx={sx.icon} />
    </Button>
  );
}

const getStyles = () => ({
  icon: { transition: transitions.smooth.fast },
  button: {
    color: 'black.40',
    p: 'xs',
    marginLeft: 'auto',
    '@media (hover: hover)': {
      '&:hover': {
        color: 'black.100',
      },
    },
  },
});

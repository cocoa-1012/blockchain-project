/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { ReactNode, useCallback, useState } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import 'tippy.js/animations/scale.css';

interface PopoverProps extends TippyProps {
  button: ReactNode;
  className?: string;
  callback?: (arg0: boolean) => void;
}

export default function Popover(props: PopoverProps): JSX.Element {
  const {
    children,
    button,
    className,
    placement = 'top-end',
    callback = () => null,
  } = props;

  const [visible, setVisible] = useState<boolean>(false);

  // here we have a button nested inside of a link
  // so when clicked we want to call preventDefault
  const handlePopper = useCallback(
    (state: boolean) => (ev) => {
      ev?.preventDefault?.();
      setVisible(state);
      callback(state);
    },
    [setVisible, callback]
  );

  const showPopper = handlePopper(true);
  const hidePopper = handlePopper(false);

  return (
    <Tippy
      content={children}
      visible={visible}
      onClickOutside={hidePopper}
      interactive={true}
      animation="scale"
      duration={100}
      delay={0}
      placement={placement}
      arrow={false}
    >
      <Box onClick={visible ? hidePopper : showPopper} className={className}>
        {button}
      </Box>
    </Tippy>
  );
}

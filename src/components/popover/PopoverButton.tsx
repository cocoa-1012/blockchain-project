/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { ReactNode } from 'react';

import { transitions } from 'utils/themes/main/theme';
import classNames from 'classnames';

interface PopoverButtonProps {
  children: ReactNode;
  className?: string;
}

export default function PopoverButton(props: PopoverButtonProps): JSX.Element {
  const { children, className } = props;
  return (
    <Flex
      className={classNames({
        [className]: true,
        'popover-button': true,
      })}
      sx={{
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        transition: transitions.smooth.fast,
        borderRadius: 999,
        cursor: 'pointer',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'black.5',
          },
          '&:active': {
            transform: 'black.10',
          },
        },
      }}
    >
      {children}
    </Flex>
  );
}

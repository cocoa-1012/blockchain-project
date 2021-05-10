/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { ReactElement } from 'react';

import EllipsisIcon from 'assets/icons/ellipsis-icon.svg';

import Popover from './Popover';
import PopoverButton from './PopoverButton';

interface PopoverExtrasProps {
  children: ReactElement;
  className?: string;
  callback?: (arg0: boolean) => void;
}

export default function PopoverExtras(props: PopoverExtrasProps): JSX.Element {
  const { children, className, callback = () => void 0 } = props;
  return (
    <Popover
      button={
        <PopoverButton>
          <EllipsisIcon sx={{ display: 'block' }} width={22} height={4} />
        </PopoverButton>
      }
      className={className}
      callback={callback}
    >
      {children}
    </Popover>
  );
}

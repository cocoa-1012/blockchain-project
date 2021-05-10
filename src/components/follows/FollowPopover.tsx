/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { ReactNode, useRef, useState } from 'react';

import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';

import CreatorPopoverCard from 'components/cards/creator-popover/CreatorPopoverCard';

import useIsomorphicLayoutEffect from 'hooks/use-isomorphic-layout-effect';

interface FollowPopoverProps {
  children: ReactNode;
  publicKey: string;
  className?: string;
}

export default function FollowPopover(props: FollowPopoverProps): JSX.Element {
  const { children, publicKey, className } = props;

  const POPOVER_DELAY = 400;

  const [shouldRender, setShouldRender] = useState(false);

  const appendRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    appendRef.current = document.getElementById('portal');
  }, []);

  return (
    <Box className={className}>
      <Tippy
        content={
          shouldRender ? (
            <CreatorPopoverCard
              publicKey={publicKey}
              isLazyLoaded={shouldRender}
              sx={{ marginY: 12, marginX: 's' }}
            />
          ) : null
        }
        interactive={true}
        animation="shift-away"
        onTrigger={() => setShouldRender(true)}
        onUntrigger={() => setShouldRender(false)}
        onShow={() => setShouldRender(true)}
        onHidden={() => setShouldRender(false)}
        placement="bottom"
        touch={false}
        delay={[POPOVER_DELAY, 0]}
        appendTo={appendRef.current}
      >
        <Box sx={{ cursor: 'pointer' }}>{children}</Box>
      </Tippy>
    </Box>
  );
}

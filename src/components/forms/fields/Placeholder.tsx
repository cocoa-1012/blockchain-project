/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';

import { transitions } from 'utils/themes/main/theme';

interface PlaceholderProps {
  value: string;
  visible: boolean;
}

export default function Placeholder(props: PlaceholderProps): JSX.Element {
  const { value, visible } = props;
  return (
    <Text
      sx={{
        position: 'absolute',
        top: 10,
        left: 20,
        fontSize: 10,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(1px)',
        transition: transitions.smooth.fast,
      }}
      variant="stnd.body"
    >
      {value}
    </Text>
  );
}

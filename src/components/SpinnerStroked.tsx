/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { keyframes, css } from '@emotion/react';

import SpinnerStrokedIcon from 'assets/icons/spinner-stroke.svg';
import SpinnerStrokedSmallIcon from 'assets/icons/spinner-stroke-small.svg';
import Icon from './Icon';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface SpinnerStrokedProps {
  size?: number;
}

export default function SpinnerStroked(
  props: SpinnerStrokedProps
): JSX.Element {
  const { size = 70 } = props;

  const isSmall = size <= 24;

  return (
    <Box
      css={css`
        animation: ${rotate} 900ms linear infinite;
      `}
      sx={{ width: size, animateFillMode: 'forwards' }}
    >
      <Icon
        // TODO: replace with small variant when ready
        icon={isSmall ? SpinnerStrokedIcon : SpinnerStrokedIcon}
        width={size}
        height={size}
      />
    </Box>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx, Button as ThemeButton, Grid, Box } from 'theme-ui';
import { css, keyframes } from '@emotion/react';
import { memo } from 'react';
import Image from 'next/image';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`;

function SmallSpinner() {
  return (
    <Image
      src="/images/spinner-small.png"
      alt="Loading spinner"
      width="52"
      height="52"
      css={css`
        animation: ${rotate} 800ms linear infinite;
        animate-fill-mode: forwards;
      `}
    />
  );
}

LoadingButton.defaultProps = {
  variant: 'loading',
};

LoadingButton.propTypes = {
  children: PropTypes.any,
  variant: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

function LoadingButton(props) {
  const { variant, children, className, isLoading, disabled, ...rest } = props;
  return (
    <ThemeButton
      {...rest}
      variant={variant}
      className={className}
      disabled={disabled || isLoading}
    >
      <Grid columns="24px auto 24px" gap="s" sx={{ alignItems: 'center' }}>
        {isLoading ? <SmallSpinner /> : <Box />}
        {children}
        <Box />
      </Grid>
    </ThemeButton>
  );
}

export const LoadingButtonSmall = memo((props) => {
  return <LoadingButton variant="small" {...props} />;
});

export default memo(LoadingButton);

/** @jsxRuntime classic */
/* @jsx jsx */
import { jsx, Box } from 'theme-ui';
import React, { ReactNode } from 'react';

type BodyProps = {
  children: ReactNode;
  className?: string;
};

export default function Body(props: BodyProps): JSX.Element {
  const { children, className } = props;
  return (
    <Box className={className} sx={sx.body}>
      {children}
    </Box>
  );
}

const sx = {
  body: {
    width: '100%',
    maxWidth: 'container',
    marginX: 'auto',
    paddingX: 'm',
  },
};

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { ReactNode } from 'react';
import { jsx, Box, Text } from 'theme-ui';

interface HintTextProps {
  bg?: string;
  color?: string;
  children: ReactNode;
  className?: string;
}

export default function HintText(props: HintTextProps): JSX.Element {
  const { bg, color, children, className } = props;
  return (
    <Box
      bg={bg}
      sx={{ borderRadius: 5, mt: 10, px: 10, py: 6 }}
      className={className}
    >
      <Text color={color} variant="stnd.sub">
        {children}
      </Text>
    </Box>
  );
}

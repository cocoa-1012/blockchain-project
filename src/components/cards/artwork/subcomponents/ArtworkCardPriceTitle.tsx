/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

interface ArtworkCardPriceTitleProps {
  children: ReactNode;
  className?: string;
}

export default function ArtworkCardPriceTitle(
  props: ArtworkCardPriceTitleProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Text
      className={className}
      variant="h.xs"
      sx={{ color: 'black.50', marginBottom: 'xs', lineHeight: 1 }}
    >
      {children}
    </Text>
  );
}

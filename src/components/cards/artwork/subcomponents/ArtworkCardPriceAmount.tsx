/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

interface ArtworkCardPriceAmountProps {
  children: ReactNode;
  className?: string;
}

export default function ArtworkCardPriceAmount(
  props: ArtworkCardPriceAmountProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Text className={className} variant="h.xs" sx={{ lineHeight: 1 }}>
      {children}
    </Text>
  );
}

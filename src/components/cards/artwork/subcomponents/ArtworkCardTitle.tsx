/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

interface ArtworkCardTitleProps {
  children: ReactNode;
}

export default function ArtworkCardTitle(
  props: ArtworkCardTitleProps
): JSX.Element {
  const { children } = props;

  return <Text variant="h.s">{children}</Text>;
}

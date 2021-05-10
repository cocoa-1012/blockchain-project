/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { ReactNode } from 'react';

interface ArtworkAuctionInfoHeadingProps {
  children: ReactNode;
}

export default function ArtworkAuctionInfoHeading(
  props: ArtworkAuctionInfoHeadingProps
): JSX.Element {
  const { children } = props;
  return (
    <Text
      sx={{
        marginBottom: 10,
        fontFamily: 'body',
        fontWeight: 600,
        fontSize: ['s', null, null, null, 'm'],
      }}
    >
      {children}
    </Text>
  );
}

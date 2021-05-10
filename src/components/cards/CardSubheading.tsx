/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, ThemeUIStyleObject } from 'theme-ui';

import { ReactNode } from 'react';

interface CardSubHeadingProps {
  children: ReactNode;
}

export default function CardSubHeading(
  props: CardSubHeadingProps
): JSX.Element {
  const { children } = props;

  const sx = getStyles();

  return (
    <Flex>
      <Text variant="h.s">
        <Text variant="gradient" sx={sx.text}>
          {children}
        </Text>
      </Text>
    </Flex>
  );
}

const getStyles = () => {
  const text: ThemeUIStyleObject = {
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
    fontSize: 22,
  };
  return { text };
};

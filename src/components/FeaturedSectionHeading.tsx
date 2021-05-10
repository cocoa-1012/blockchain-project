/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Text } from 'theme-ui';
import { ReactNode } from 'react';

import { StyleObject } from 'types/styles';

import InternalLink from './links/InternalLink';

interface FeaturedSectionHeadingProps {
  children: ReactNode;
  linkHref?: string;
  linkText?: string;
  className?: string;
}

export default function FeaturedSectionHeading(
  props: FeaturedSectionHeadingProps
): JSX.Element {
  const { children, linkHref, linkText, className } = props;

  const sx = getStyles();

  return (
    <Box
      sx={{
        borderBottom: 'solid 1px',
        borderColor: 'black.10',
        marginBottom: 'm',
      }}
    >
      <Flex sx={sx.container} className={className}>
        <Text sx={sx.heading}>{children}</Text>
        {linkHref && (
          <InternalLink sx={{ fontSize: ['body', 'xs'] }} href={linkHref}>
            {linkText}
          </InternalLink>
        )}
      </Flex>
    </Box>
  );
}

const getStyles = (): StyleObject => ({
  container: {
    paddingTop: ['xl', 'xxl', 'xxxl'],
    paddingBottom: 'm',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  heading: {
    fontFamily: 'body',
    fontWeight: 600,
    fontSize: [20, 's'],
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  button: {
    borderRadius: 999,
    paddingX: ['m', 'l'],
    minHeight: [44, 56],
  },
});

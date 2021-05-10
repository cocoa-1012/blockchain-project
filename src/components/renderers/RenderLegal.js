/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Box, Text } from 'theme-ui';

import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { transitions } from 'utils/themes/main/theme';

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <Heading
        as="h1"
        variant="heading.h1"
        sx={{
          marginTop: ['l', 'xl'],
          marginBottom: 'm',
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <Heading
        as="h2"
        variant="heading.h2"
        sx={{
          marginTop: ['l', 'xl'],
          marginBottom: 'm',
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <Heading
        as="h3"
        variant="heading.m"
        sx={{
          marginTop: ['l', 'xl'],
          marginBottom: 'm',
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <Text
        as="p"
        variant="body.body"
        sx={{
          color: 'black.100',
          marginBottom: 'm',
          li: {
            listStyle: 'disc',
            marginBottom: 's',
            marginLeft: 'm',
          },
          a: {
            color: 'currentcolor',
            textDecoration: 'none',
            borderBottom: '1px solid',
            borderBottomColor: 'black.10',
            transition: transitions.smooth.fast,
            '&:hover': {
              borderBottomColor: 'black.100',
            },
          },
        }}
      >
        {children}
      </Text>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <Box variant="text.body.body">
        <ul sx={{ mb: 'l' }}>{children}</ul>
      </Box>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li
        sx={{
          listStyle: 'disc',
          marginBottom: 's',
          marginLeft: 'm',
          '& > p': { mb: 0 },
        }}
      >
        {children}
      </li>
    ),
  },
};

export default function RenderLegal(doc) {
  return documentToReactComponents(doc, options);
}

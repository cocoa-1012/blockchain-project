/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Text, Link } from 'theme-ui';

import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { ArticleImage } from 'components/ArticleImage';

const sx = {
  measure: {
    maxWidth: 720,
    marginX: 'auto',
  },
};

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <Heading
        as="h1"
        variant="heading.h1"
        sx={{ ...sx.measure, marginBottom: ['m', null, 'l'] }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <Heading
        as="h2"
        variant="heading.h2"
        sx={{
          ...sx.measure,
          marginBottom: ['s', 'm', 'l'],
          marginTop: ['l', null, 'xl'],
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <Heading
        as="h3"
        variant="heading.h3"
        sx={{
          ...sx.measure,
          marginBottom: ['s', 'm', 'l'],
          marginTop: ['l', null, 'xl'],
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <Text
        variant="body.mid"
        sx={{
          ...sx.measure,
          marginY: ['m', null, 'l'],
        }}
        className="paragraph"
      >
        {children}
      </Text>
    ),
    [INLINES.HYPERLINK]: (node) => {
      const { uri } = node.data;
      const [content] = node.content;

      // if (uri.includes('https://twitter.com/')) {
      //   const [tweetId] = uri.match(/(\d+)$/gm, '');
      //   return (
      //     <Box
      //       marginBottom={['s', 'm', 'xl']}
      //       marginTop={['s', 'm', 'xl']}
      //       sx={{
      //         '& .twitter-tweet': {
      //           marginX: 'auto',
      //         },
      //       }}
      //     >
      //       <Tweet tweetId={tweetId} />
      //     </Box>
      //   );
      // }

      return (
        <Link href={uri} target="_blank" variant="inline">
          {content.value}
        </Link>
      );
    },
    [BLOCKS.QUOTE]: (node, children) => (
      <Text
        as="blockquote"
        variant="heading.h3"
        sx={{
          maxWidth: 540,
          marginX: 'auto',
          marginBottom: ['l', 'xl', 'xxl', 'xxxl'],
          marginTop: ['l', 'xl', 'xxl', 'xxxl'],
          textAlign: 'center',
          '& > p': {
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'body',
            lineHeight: 1.4,
          },
          '& > p:last-child:not(:first-of-type)': {
            fontSize: 'sub',
            fontFamily: 'mono',
            fontWeight: 'body',
            lineHeight: 1.7,
            letterSpacing: 0,
          },
        }}
      >
        {children}
      </Text>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <Text
        as="ol"
        variant="body.mid"
        sx={{
          ...sx.measure,
          listStyle: 'decimal',
          marginTop: ['m', null, 'l'],
          marginBottom: ['m', null, 'xl', 'xxl'],
          paddingLeft: ['m', 'l'],
          '& .paragraph': {
            marginY: 's',
          },
        }}
      >
        {children}
      </Text>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <Text
        as="ul"
        variant="body.mid"
        sx={{
          ...sx.measure,
          listStyle: 'initial',
          marginTop: ['m', null, 'l'],
          marginBottom: ['m', null, 'xl', 'xxl'],
          paddingLeft: ['m', 'l'],
          '& .paragraph': {
            marginY: 's',
          },
        }}
      >
        {children}
      </Text>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const file = node?.data?.target?.fields?.file;

      if (!file) {
        return null;
      }

      const mimeType = file?.contentType;
      const [mimeGroup] = mimeType.split('/');

      if (mimeGroup === 'image') {
        return <ArticleImage src={file.url} />;
      }
    },
  },
};

export default function RenderArticle(doc) {
  return documentToReactComponents(doc, options);
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Heading, Image, Flex, Text } from 'theme-ui';

import Link from 'components/links/Link';
import { urlWithParams } from 'utils/urls';
import { postedOn } from 'utils/dates/dates';
import { transitions } from 'utils/themes/main/theme';

export default function ArticleBlock(props) {
  const { article } = props;

  const sx = getStyles();

  const imageArgs = {
    q: 90,
    w: 630,
    h: 420,
    fit: 'pad',
  };

  return (
    <Link href={`/blog/${article.slug}`}>
      <Flex as="a" sx={sx.card}>
        <Box sx={sx.bb}>
          <Image
            src={urlWithParams(article?.coverImage, imageArgs)}
            sx={sx.db}
          />
        </Box>
        <Box sx={{ p: 'l' }}>
          <Heading variant="h.s" mb="s" sx={sx.title}>
            {article.title}
          </Heading>
          <Text variant="body.body">{article?.shortDescription}</Text>
        </Box>
        <Box sx={{ px: 'l', pb: 'l', mt: 'auto' }}>
          <Text mt="auto" variant="mono.caption">
            Published {postedOn(article?.datePosted)}
          </Text>
        </Box>
      </Flex>
    </Link>
  );
}

const getStyles = () => ({
  card: {
    border: 'black.2',
    flexDirection: 'column',
    textDecoration: 'none',
    color: 'black.100',
    transition: transitions.smooth.fast,
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 'l',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
  },
  title: { lineHeight: 1.2 },
  bb: { borderBottom: 'black.2' },
  db: { display: 'block', width: '100%' },
});

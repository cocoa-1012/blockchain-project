/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Grid, Heading, Text, Image } from 'theme-ui';
import { take } from 'ramda';

import { getAllArticles } from 'queries/server/articles';

import Page from 'components/Page';
import Body from 'components/Body';
import Link from 'components/links/Link';
import { ArticleGrid } from 'components/Articles';

import { transitions } from 'utils/themes/main/theme';
import { urlWithParams } from 'utils/urls';
import { postedOn } from 'utils/dates/dates';

import { PageTypes } from 'types/page';

export default function BlogIndex(props) {
  const { articles } = props;
  const [featuredArticle, ...otherArticles] = articles;
  return (
    <Page title="Blog" type={PageTypes.maximal}>
      <Body
        sx={{
          paddingY: ['l', 'xl', 'xxl', 'xxxl'],
          position: 'relative',
          zIndex: 4,
        }}
      >
        <Box mb={['l', null, 'xl']}>
          <FeaturedArticle article={featuredArticle} />
        </Box>
        <ArticleGrid articles={otherArticles} />
      </Body>
    </Page>
  );
}

export function FeaturedArticle(props) {
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
      <Grid
        as="a"
        sx={sx.card}
        columns={[1, null, null, '450px auto', '600px auto']}
      >
        <Box sx={sx.bb}>
          <Image
            src={urlWithParams(article?.coverImage, imageArgs)}
            sx={sx.db}
          />
        </Box>
        <Flex
          sx={{ p: ['l', null, null, null, 'xl'], flexDirection: 'column' }}
        >
          <Heading variant="h.l" mb="s" sx={sx.title}>
            {article.title}
          </Heading>
          <Text variant="body.mid" sx={sx.excerpt}>
            {article?.shortDescription}
          </Text>
          <Box sx={{ pt: 'l', mt: 'auto' }}>
            <Text mt="auto" variant="mono.caption">
              Published {postedOn(article?.datePosted)}
            </Text>
          </Box>
        </Flex>
      </Grid>
    </Link>
  );
}

const getStyles = () => ({
  card: {
    border: 'black.2',
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
  title: { lineHeight: 0.9, maxWidth: 560, mb: 'l' },
  excerpt: { maxWidth: 420 },
  bb: {
    borderBottom: ['black.2', null, null, 'none'],
    borderRight: [null, null, null, 'black.2'],
    display: [null, null, null, 'flex'],
  },
  db: {
    display: 'block',
    width: '100%',
    objectFit: [null, null, null, 'cover'],
  },
});

export async function getStaticProps() {
  const articles = await getAllArticles();

  return {
    props: {
      articles,
    },
    revalidate: 60,
  };
}

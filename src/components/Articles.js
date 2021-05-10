/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex, Box } from 'theme-ui';
import ArticleBlock from 'components/blog/ArticleBlock';

export function LatestArticles(props) {
  const { articles } = props;
  const sx = getStyles();

  return (
    <Flex sx={sx.container}>
      <Box>
        <ArticleGrid articles={articles} />
      </Box>
    </Flex>
  );
}

export function ArticleGrid(props) {
  const { articles } = props;
  return (
    <Grid columns={[1, 1, 3]} gap="s">
      {articles.map((article) => (
        <ArticleBlock article={article} key={article.title} />
      ))}
    </Grid>
  );
}

const getStyles = () => ({
  container: {
    flexDirection: ['column'],
    alignItems: ['center'],
  },
  buttonWrapper: {
    pt: ['xl', 0],
    width: '100%',
  },
  buttonLargeOutline: {
    fontSize: [24, 36],
    fontWeight: 300,
  },
});

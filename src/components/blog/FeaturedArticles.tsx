/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';

import Body from 'components/Body';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import HomePageButton from 'components/buttons/HomePageButton';
import { ArticleGrid } from 'components/Articles';

import { positionRelative } from 'types/styles';

interface FeaturedArticlesProps {
  articles: any[];
}

export default function FeaturedArticles(
  props: FeaturedArticlesProps
): JSX.Element {
  const { articles } = props;
  return (
    <Body sx={{ position: positionRelative, zIndex: 4 }}>
      <FeaturedSectionHeading linkHref="/blog" linkText="View all articles">
        Blog
      </FeaturedSectionHeading>
      <Grid gap="l">
        <ArticleGrid articles={articles} />
        <HomePageButton href="/blog">View all articles</HomePageButton>
      </Grid>
    </Body>
  );
}

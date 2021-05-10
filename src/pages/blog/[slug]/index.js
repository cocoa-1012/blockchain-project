import React from 'react';
import { Box, Text, Heading, Image } from 'theme-ui';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { getAllArticles, getArticleBySlug } from 'queries/server/articles';

import Page from 'components/Page';
import Body from 'components/Body';

import { buildAvatarUrl, urlWithParams } from 'utils/urls';
import { postedOn } from 'utils/dates/dates';
import RenderArticle from 'components/renderers/RenderArticle';
import LoadingPage from 'components/LoadingPage';

BlogArticle.propTypes = {
  article: PropTypes.object.isRequired,
};

export default function BlogArticle(props) {
  const { article } = props;

  const sx = getStyles();
  const router = useRouter();

  const coverImageUrl = urlWithParams(article?.coverImage, {
    q: 90,
    w: 1920,
    fit: 'fill',
  });

  const avatarUrl = buildAvatarUrl(article?.author?.avatar);

  if (router.isFallback) {
    return <LoadingPage />;
  }

  return (
    <Page
      title={article?.title}
      description={article?.shortDescription}
      image={coverImageUrl}
    >
      <Box sx={{ paddingTop: [null, null, 'xxl', 'xxxl'] }}>
        {article?.coverImage && (
          <Box sx={sx.coverImage}>
            <Image
              alt={article?.title}
              src={coverImageUrl}
              style={{ width: '100%', display: 'block' }}
            />
          </Box>
        )}

        <Box sx={sx.excerptContainer}>
          <Box sx={sx.excerpt}>
            <Text as="h1" variant="heading.title" sx={sx.heading}>
              {article?.title}
            </Text>

            <Text as="p" variant="body.mid" sx={sx.description}>
              {article?.shortDescription}
            </Text>

            {article?.datePosted && (
              <Text mt="auto" variant="mono.caption">
                Published {postedOn(article?.datePosted)}
              </Text>
            )}
          </Box>
        </Box>
      </Box>

      <Body>
        <Box>{RenderArticle(article?.content)}</Box>

        <Box sx={sx.author.box}>
          <Box sx={sx.author.image}>
            {article?.author?.avatar && (
              <Image
                alt={article?.author?.name}
                src={avatarUrl}
                style={{ width: '100%', display: 'block' }}
              />
            )}
          </Box>
          <Box>
            <Text sx={sx.author.sub}>Written by</Text>
            <Heading as="h3" sx={sx.author.name}>
              {article?.author?.name}
            </Heading>
            <Text as="p" sx={sx.author.role}>
              {article?.author?.role}
            </Text>
          </Box>
        </Box>
      </Body>
    </Page>
  );
}

export async function getStaticPaths() {
  const articles = await getAllArticles();
  const paths = articles.map((article) => ({
    params: {
      slug: article.slug,
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);

  return {
    props: {
      article,
    },
    revalidate: 60,
  };
}

const getStyles = () => ({
  heading: {
    marginBottom: ['m', 'l', 'xl'],
  },
  container: {
    maxWidth: 1080,
    marginX: 'auto',
    paddingTop: [null, null, 'l'],
  },
  page: {
    bg: 'white.100',
    position: 'relative',
    zIndex: 1,
  },
  coverImage: {
    borderColor: 'black.100',
    borderWidth: 3,
    borderStyle: 'solid',
    borderLeft: ['none', null, null, 'solid'],
    borderRight: ['none', null, null, 'solid'],
    maxWidth: 1080,
    mx: 'auto',
  },
  excerptContainer: {
    marginX: 'm',
    marginTop: [-30],
  },
  excerpt: {
    bg: 'white.100',
    position: 'relative',
    zIndex: 1,
    maxWidth: 910,
    marginX: 'auto',
    marginBottom: ['l', 'xl', 'xxxl'],
    paddingX: ['m', null, 'xxl'],
    paddingY: ['m', null, 'xl'],

    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: 'black.100',
  },
  description: {
    maxWidth: 420,
    mb: ['m', null, 'l'],
  },
  main: {
    maxWidth: 1080,

    paddingX: ['l', 'xxl'],
    paddingBottom: ['l', null, 'xxl'],
  },
  author: {
    box: {
      display: 'flex',
      flexDirection: ['column', 'column', 'row'],
      alignItems: ['flex-start', 'flex-start', 'center'],

      width: '100%',
      maxWidth: 500,
      border: '3px solid',
      borderColor: 'black.100',

      padding: 'l',
      marginX: 'auto',
      marginTop: ['xl', 'xl', 'xxxl'],
    },
    image: {
      width: 120,
      borderRadius: '50%',
      overflow: 'hidden',
      marginRight: [0, 0, 'm'],
      marginBottom: ['m', 0, 0],
    },
    sub: {
      fontFamily: 'mono',
      fontSize: 'sub',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    name: {
      fontWeight: 'heading',
      fontFamily: 'body',
      fontSize: 33,
      marginTop: 'xs',
    },
    role: {
      fontWeight: 'sub',
      fontFamily: 'body',
      fontSize: 'xs',
      marginTop: 'xs',
    },
  },
});

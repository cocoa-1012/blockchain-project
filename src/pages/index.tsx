/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { GetStaticPropsResult } from 'next';

import Page from 'components/Page';
import Body from 'components/Body';
import FeaturedArtworks from 'components/artworks/FeaturedArtworks';
import FeaturedArticles from 'components/blog/FeaturedArticles';
import FeaturedCreators from 'components/creators/FeaturedCreators';
import FeaturedArtwork from 'components/artworks/featured-artwork/FeaturedArtwork';

import TrendingAuctions from 'components/artworks/TrendingAuctions';
import PreFooter from 'components/footers/PreFooter';
import PreviewMode from 'components/PreviewMode';

import Artwork from 'types/Artwork';
import Account from 'types/Account';

import { getAllArticles } from 'queries/server/articles';
import { getFeaturedContentIds } from 'queries/server/content';
import { getHasuraUsersByUsernames } from 'queries/hasura/users';

import {
  getArtworksByTokenIds,
  getGraphAndServerArtwork,
} from 'queries/artworks';

import useAuthToken from 'hooks/queries/use-auth-token';

import getChainId from 'lib/chainId';

import { getSortedArtworks } from 'utils/artwork/artwork';
import { getFeaturedArticles } from 'utils/helpers';
import { sortCreatorsByUsernames } from 'utils/creator';
import { maybeGetAddress } from 'utils/users';
import { PageTypes } from 'types/page';

interface IndexPageProps {
  preview: boolean;
  articles: any[];
  featuredCreators: Account[];
  featuredArtwork: Artwork;
  featuredArtworks: Artwork[];
}

export default function IndexPage(props: IndexPageProps): JSX.Element {
  const {
    preview,
    articles,
    featuredCreators,
    featuredArtworks,
    featuredArtwork,
  } = props;

  const creatorIds = featuredCreators.map((creator) =>
    maybeGetAddress(creator.publicKey)
  );

  const { user } = useAuthToken();

  const publicAddress = user?.publicAddress;

  return (
    <Page title={false} type={PageTypes.maximal}>
      {preview && <PreviewMode />}

      {featuredArtwork && (
        <Body>
          <FeaturedArtwork artwork={featuredArtwork} />
        </Body>
      )}

      <Grid
        sx={{
          paddingBottom: ['l', 'xl', 'xxl', 'xxxl'],
          gap: ['s', null, 'l'],
        }}
      >
        <TrendingAuctions />
        <Grid sx={{ gap: ['xl', 'xxl', 'xxxl'] }}>
          <FeaturedArtworks
            featuredArtworks={featuredArtworks}
            publicAddress={publicAddress}
          />
          <Body sx={{ position: 'relative', zIndex: 4 }}>
            <FeaturedCreators
              creatorIds={creatorIds}
              publicAddress={publicAddress}
            />
          </Body>
        </Grid>

        <FeaturedArticles articles={articles} />
      </Grid>
      <PreFooter />
    </Page>
  );
}

export async function getStaticProps({
  preview = false,
}: {
  preview: boolean;
}): Promise<GetStaticPropsResult<IndexPageProps>> {
  const chainId = getChainId();

  const {
    highlightedNFTId,
    featuredNFTIds,
    featuredCreatorUsernames,
  } = await getFeaturedContentIds({
    preview,
    chainId,
  });

  const articles = await getAllArticles();

  const featuredArtwork =
    highlightedNFTId &&
    (await getGraphAndServerArtwork({ tokenId: highlightedNFTId }));

  const featuredArtworks =
    featuredNFTIds &&
    (await getArtworksByTokenIds({
      tokenIds: featuredNFTIds,
      excludeHidden: true,
    }));

  const featuredCreatorsQuery = await getHasuraUsersByUsernames(
    featuredCreatorUsernames
  );

  return {
    props: {
      preview,
      featuredCreators: sortCreatorsByUsernames(
        featuredCreatorUsernames,
        featuredCreatorsQuery.users
      ),
      featuredArtwork: featuredArtwork ?? null,
      featuredArtworks: getSortedArtworks(featuredNFTIds)(featuredArtworks),
      articles: getFeaturedArticles(articles),
    },
    revalidate: 60,
  };
}

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Grid } from 'theme-ui';
import { GetStaticPropsResult } from 'next';

import Page from 'components/Page';
import Body from 'components/Body';
import FeaturedArtworks from 'components/artworks/FeaturedArtworks';
import FeaturedCreators from 'components/creators/FeaturedCreators';
import FeaturedArticles from 'components/blog/FeaturedArticles';
import FeaturedArtwork from 'components/artworks/featured-artwork/FeaturedArtwork';
import LiveAuctions from 'components/artworks/LiveAuctions';
import PreFooter from 'components/footers/PreFooter';
import PreviewMode from 'components/PreviewMode';

//import Artwork from 'types/Artwork';
//import Account from 'types/Account';

//import { getAllArticles } from 'queries/server/articles';
//import { getFeaturedContentIds } from 'queries/server/content';
import { getHasuraUsersByUsernames } from 'queries/hasura/users';

import {
  getArtworksByTokenIds,
  getGraphAndServerArtwork,
} from 'queries/artworks';

import getChainId from 'lib/chainId';

import { getSortedArtworks } from 'utils/artwork/artwork';
import { getFeaturedArticles } from 'utils/helpers';
import { sortCreatorsByUsernames } from 'utils/creator';

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

  return (
    <Page title={false} footerStyle={{ backgroundColor: 'black.5' }}>
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
        <LiveAuctions />
        <FeaturedArtworks featuredArtworks={featuredArtworks} />
        <FeaturedCreators featuredCreators={featuredCreators} />
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
      featuredArtwork,
      featuredArtworks: getSortedArtworks(featuredNFTIds)(featuredArtworks),
      articles: getFeaturedArticles(articles),
    },
    revalidate: 60,
  };
}

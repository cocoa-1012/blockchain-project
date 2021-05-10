/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { GetStaticPropsResult } from 'next';
import NextLink from 'next/link';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Hero from 'components/explore/Hero';
import TrendingAuctions from 'components/artworks/TrendingAuctions';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import FeaturedWorlds from 'components/worlds/FeaturedWorlds';
import HomePageButton from 'components/buttons/HomePageButton';
import BrowseCard from 'components/explore/BrowseCard';
import TrendingCreatorsMini from 'components/trending/TrendingCreatorsMini';
import TrendingCollectorsMini from 'components/trending/TrendingCollectorsMini';
import AnimatedShape from 'components/animation/AnimatedShape';

import WorldsLogoType from 'assets/images/worlds-logotype.svg';

import { getTokenId } from 'utils/products';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { notEmptyOrNil, rejectNils } from 'utils/helpers';
import { formatInteger } from 'utils/formatters';

import getChainId from 'lib/chainId';

import { VideoAssetQuality } from 'types/Assets';
import { WorldCardSimple } from 'types/World';

import { getWorldsOrder } from 'queries/server/content';
import { getArtworksByTokenIds } from 'queries/artworks';
import { getHasuraUsersByUsernames } from 'queries/hasura/users';

import {
  getGlobalCounts,
  GlobalCountsData,
} from 'hooks/queries/hasura/use-global-counts';
import { PageTypes } from 'types/page';

interface ExplorePageProps {
  globalCounts: GlobalCountsData;
  featuredWorlds: WorldCardSimple[];
  preview?: boolean;
}

export default function Explore(props: ExplorePageProps): JSX.Element {
  const { featuredWorlds, globalCounts } = props;
  const artworkCount = formatInteger(
    globalCounts?.artwork_aggregate.aggregate.count
  );
  const profileCount = formatInteger(
    globalCounts?.user_aggregate.aggregate.count
  );

  return (
    <Page
      title="Explore"
      image="https://foundation.app/explore_opengraph.jpg"
      type={PageTypes.maximal}
    >
      <Body css={{ paddingX: 0 }}>
        <Hero>
          <AnimatedShape
            src="/images/shapes/prism.png"
            alt="prism"
            css={{
              display: 'none',
              '@bp3': { display: 'block', alignSelf: 'flex-start' },
            }}
          />
          <Box
            css={{
              paddingY: '$8',
              '@bp1': { marginX: '$9', paddingY: 160 },
            }}
          >
            <h1>
              <img
                style={{
                  maxWidth: 'unset',
                  width: 'min(80vw, 800px)',
                }}
                src="/images/svg-text/explore-foundation.svg"
                alt="Explore Foundation"
              />
            </h1>
          </Box>
          <AnimatedShape
            src="/images/shapes/sphere.png"
            alt="sphere"
            css={{
              display: 'none',
              '@bp3': {
                display: 'block',
                marginBottom: '$6',
              },
            }}
          />
        </Hero>
        <Box css={{ position: 'relative', '@bp1': { marginTop: 650 } }}>
          <Grid
            css={{
              maxWidth: 1600,
              marginBottom: '$8',
              marginX: 'auto',
              paddingX: '$6',
              gridGap: '$7',
              gridTemplateColumns: 'minmax(0, 1fr)',
              '@bp1': {
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gridGap: '$9',
              },
            }}
          >
            <TrendingCreatorsMini />
            <TrendingCollectorsMini />
          </Grid>
          <HomePageButton href="/trending">View Trending</HomePageButton>
          <Flex
            css={{
              maxWidth: 1600,
              marginTop: '$11',
              marginX: 'auto',
              paddingX: '$6',
              flexDirection: 'column',
              alignItems: 'center',
              gridGap: '16px',
              '@bp1': {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              },
            }}
          >
            <NextLink href="/worlds" passHref>
              <Box as="a" css={{ width: '100%', '@bp1': { maxWidth: 500 } }}>
                <WorldsLogoType style={{ width: '100%' }} />
              </Box>
            </NextLink>
            <Text
              css={{
                fontFamily: '$body',
                lineHeight: 1.6,
                textAlign: 'center',
                maxWidth: 284,
                '@bp1': { textAlign: 'right' },
              }}
            >
              Explore new worlds curated by the Foundation creative community
            </Text>
          </Flex>
          <Box
            css={{
              maxWidth: 1600,
              marginY: '$8',
              marginX: 'auto',
              paddingX: '$6',
              '@media(max-width: 800px)': {
                'a:nth-child(-n+8):nth-child(n+5)': {
                  display: 'none',
                },
              },
            }}
          >
            <FeaturedWorlds featuredWorlds={featuredWorlds} />
          </Box>
          <HomePageButton href="/worlds">View Worlds</HomePageButton>
          <TrendingAuctions artworkCount={8} />
          <Box css={{ marginTop: '$8' }}>
            <HomePageButton href="/artworks?refinementList%5Bavailability%5D%5B0%5D=LIVE_AUCTION">
              View Auctions
            </HomePageButton>
          </Box>
        </Box>
        <Grid
          css={{
            paddingX: '$6',
            marginY: '$10',
            gridGap: '$6',
            '@bp1': {
              gridTemplateColumns: '1fr 1fr',
            },
          }}
        >
          <BrowseCard href="/artworks" statistic={`${artworkCount} artworks`}>
            Browse all <br /> artworks
          </BrowseCard>
          <BrowseCard href="/profiles" statistic={`${profileCount} profiles`}>
            Browse all <br /> profiles
          </BrowseCard>
        </Grid>
      </Body>
    </Page>
  );
}

export async function getStaticProps({
  preview = false,
}: {
  preview: boolean;
}): Promise<GetStaticPropsResult<ExplorePageProps>> {
  const chainId = getChainId();
  const worlds = await getWorldsOrder({ preview, chainId });
  const shuffledWorlds = worlds.sort(() => Math.random() - 0.5).slice(0, 8);

  const featuredWorldNFTIds = shuffledWorlds.map((c) =>
    getTokenId(c.fields.featuredNft)
  );

  const curatorCreatorsUsernames = worlds
    .map((value) =>
      value?.fields?.curatedBy
        ?.substring(value?.fields?.curatedBy?.lastIndexOf('/') + 1)
        .trim()
        .replace(/^@/, '')
    )
    .filter((value) => notEmptyOrNil(value));

  const curatorCreatorsQuery = await getHasuraUsersByUsernames(
    curatorCreatorsUsernames
  );

  const featuredCategoryArtworks = await getArtworksByTokenIds({
    tokenIds: featuredWorldNFTIds,
    excludeHidden: true,
  });

  const worldData = shuffledWorlds.map((c) => {
    const featuredNftAssetId = getTokenId(c.fields.featuredNft);
    const featuredNftAsset = featuredCategoryArtworks.find(
      (a) => a.tokenId === featuredNftAssetId
    );

    if (featuredNftAsset) {
      const assetUrl = buildArtworkAssetUrl(
        { h: 640, q: 80, quality: VideoAssetQuality.Preview },
        featuredNftAsset
      );
      const posterUrl = buildPosterUrl(featuredNftAsset);

      const curatedByUsername = c?.fields?.curatedBy
        ?.substring(c?.fields?.curatedBy?.lastIndexOf('/') + 1)
        .trim()
        .toLowerCase()
        .replace(/^@/, '');

      return {
        title: c.fields.title,
        slug: c.fields.slug,
        assetUrl: assetUrl,
        posterUrl: posterUrl,
        curatedBy:
          curatorCreatorsQuery.users.find(
            (u) => u.username.toLowerCase() === curatedByUsername
          ) ?? null,
      };
    }
    return null;
  });

  const globalCounts = await getGlobalCounts();

  return {
    props: {
      featuredWorlds: rejectNils(worldData),
      globalCounts,
    },
    revalidate: 60,
  };
}

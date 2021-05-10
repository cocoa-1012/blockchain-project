/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';
import { GetStaticPropsResult } from 'next';

import PreviewMode from 'components/PreviewMode';
import Body from 'components/Body';
import Page from 'components/Page';
import WorldCard from 'components/cards/worlds/WorldCard';

import WorldsLogoType from 'assets/images/worlds-logotype.svg';

import getChainId from 'lib/chainId';

import { getWorldsOrder } from 'queries/server/content';
import { getHasuraUsersByUsernames } from 'queries/hasura/users';
import { getArtworksByTokenIds } from 'queries/artworks';

import { getTokenId } from 'utils/products';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { notEmptyOrNil, rejectNils } from 'utils/helpers';

import { VideoAssetQuality } from 'types/Assets';
import { WorldCardSimple } from 'types/World';

interface WorldsPageProps {
  preview: boolean;
  worlds: WorldCardSimple[];
}

export default function WorldsPage(props: WorldsPageProps): JSX.Element {
  const { preview, worlds } = props;

  return (
    <Page title={false}>
      {preview && <PreviewMode />}
      <Body>
        <WorldsLogoType sx={{ marginY: 's' }} />

        <Grid
          sx={{
            gridTemplateColumns: ['repeat(2,1fr)', null, 'repeat(4, 1fr)'],
            paddingBottom: ['l', 'xl', 'xxl', 'xxxl'],
            gap: ['s', null, 'l'],
          }}
        >
          {worlds.map((w) => {
            return (
              <WorldCard
                key={w.slug}
                title={w.title}
                assetUrl={w.assetUrl}
                posterUrl={w.posterUrl}
                curatedBy={w.curatedBy}
                href={`/worlds/${w.slug}`}
              />
            );
          })}
        </Grid>
      </Body>
    </Page>
  );
}

export async function getStaticProps({
  preview = false,
}: {
  preview: boolean;
}): Promise<GetStaticPropsResult<WorldsPageProps>> {
  const chainId = getChainId();

  const worlds = await getWorldsOrder({ preview, chainId });

  const featuredNFTIds = worlds.map((w) => getTokenId(w.fields.featuredNft));
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

  const featuredArtworks = await getArtworksByTokenIds({
    tokenIds: featuredNFTIds,
  });

  const worldData = worlds.map((w) => {
    const featuredNftAssetId = getTokenId(w.fields.featuredNft);
    const featuredNftAsset = featuredArtworks.find(
      (a) => a.tokenId === featuredNftAssetId
    );

    if (featuredNftAsset) {
      const assetUrl = buildArtworkAssetUrl(
        { h: 640, q: 80, quality: VideoAssetQuality.Preview },
        featuredNftAsset
      );
      const posterUrl = buildPosterUrl(featuredNftAsset);

      const curatedByUsername = w?.fields?.curatedBy
        ?.substring(w?.fields?.curatedBy?.lastIndexOf('/') + 1)
        .trim()
        .toLowerCase()
        .replace(/^@/, '');

      return {
        title: w.fields.title,
        slug: w.fields.slug,
        assetUrl: assetUrl,
        posterUrl: posterUrl,
        curatedBy:
          curatorCreatorsQuery.users.find(
            (u) => u.username.toLowerCase() === curatedByUsername
          ) ?? null,
      };
    }
    // staging data may not match
    return null;
  });

  return {
    props: {
      preview,
      // remove nulls from the data array
      worlds: rejectNils(worldData),
    },
    revalidate: 60,
  };
}

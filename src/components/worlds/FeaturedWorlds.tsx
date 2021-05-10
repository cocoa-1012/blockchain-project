/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid } from 'theme-ui';

import WorldCard from 'components/cards/worlds/WorldCard';

import { WorldCardSimple } from 'types/World';

interface FeaturedWorldsProps {
  featuredWorlds: WorldCardSimple[];
}

export default function FeaturedWorlds(
  props: FeaturedWorldsProps
): JSX.Element {
  const { featuredWorlds } = props;

  if (!featuredWorlds) {
    return null;
  }

  return (
    <Grid
      sx={{
        gridTemplateColumns: ['repeat(2,1fr)', null, 'repeat(4, 1fr)'],
        gap: ['s', null, 'l'],
      }}
    >
      {featuredWorlds.map((props: WorldCardSimple) => {
        const { slug, title, posterUrl, assetUrl, curatedBy } = props;

        return (
          <WorldCard
            key={slug}
            href={`/worlds/${slug}`}
            title={title}
            assetUrl={assetUrl}
            curatedBy={curatedBy}
            posterUrl={posterUrl}
          />
        );
      })}
    </Grid>
  );
}

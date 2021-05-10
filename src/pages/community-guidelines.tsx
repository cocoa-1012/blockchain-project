/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import RenderLegal from 'components/renderers/RenderLegal';
import Page from 'components/Page';
import Body from 'components/Body';

import { getContentfulContent } from 'queries/server/content';
import { lastUpdated } from 'utils/dates/dates';
import { TextHero } from 'components/blocks/TextHero';
import { positionRelative } from 'types/styles';
import { PageTypes } from 'types/page';

export default function CommunityGuidelines(props) {
  const sx = getStyles();

  const { communityGuidelines, updatedAt } = props;

  return (
    <Page title="Community Guidelines" type={PageTypes.maximal}>
      <Body sx={sx.container}>
        <TextHero
          heading="Community Guidelines"
          subheading={`Last updated – ${lastUpdated(updatedAt)}`}
        />
        {communityGuidelines && (
          <main sx={sx.wrapper}>{RenderLegal(communityGuidelines)}</main>
        )}
      </Body>
    </Page>
  );
}

export async function getStaticProps() {
  const { communityGuidelines, updatedAt } = await getContentfulContent();

  return {
    props: {
      communityGuidelines,
      updatedAt,
    },
    revalidate: 60,
  };
}

const getStyles = () => ({
  container: {
    backgroundColor: 'white.100',
    position: positionRelative,
    zIndex: 1,
  },
  wrapper: {
    maxWidth: 820,
    paddingX: 'l',
    margin: '0 auto',
    paddingBottom: 'xxxl',
  },
  text: {
    color: 'black.100',
    marginBottom: 'm',
    li: {
      listStyle: 'disc',
      marginBottom: 's',
      marginLeft: 'm',
      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
  heading: {
    marginTop: ['l', 'xl'],
    marginBottom: 'm',
  },
});

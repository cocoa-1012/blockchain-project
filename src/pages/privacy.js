/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import { TextHero } from 'components/blocks/TextHero';
import RenderLegal from 'components/renderers/RenderLegal';

import { getContentfulContent } from 'queries/server/content';
import { lastUpdated } from 'utils/dates/dates';
import Page from 'components/Page';
import Body from 'components/Body';

import { PageTypes } from 'types/page';

export default function PrivacyPolicy(props) {
  const sx = getStyles();

  const { privacy, updatedAt } = props;

  return (
    <Page title="Privacy Policy" type={PageTypes.maximal}>
      <Body sx={sx.container}>
        <TextHero
          heading="Privacy Policy"
          subheading={`Last updated – ${lastUpdated(updatedAt)}`}
        />
        {privacy && <main sx={sx.wrapper}>{RenderLegal(privacy)}</main>}
      </Body>
    </Page>
  );
}

export async function getStaticProps() {
  const { privacy, updatedAt } = await getContentfulContent();

  return {
    props: {
      privacy: privacy ?? null,
      updatedAt: updatedAt ?? null,
    },
    revalidate: 60,
  };
}

const getStyles = () => ({
  container: {
    bg: 'white.100',
    position: 'relative',
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

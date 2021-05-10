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

import { PageTypes } from 'types/page';

export default function TermsOfService(props) {
  const sx = getStyles();

  const { terms, updatedAt } = props;

  return (
    <Page title="Terms of Service" type={PageTypes.maximal}>
      <Body sx={sx.container}>
        <TextHero
          heading="Terms of Service"
          subheading={`Last updated – ${lastUpdated(updatedAt)}`}
        />
        {terms && <main sx={sx.wrapper}>{RenderLegal(terms)}</main>}
      </Body>
    </Page>
  );
}

export async function getStaticProps() {
  const { terms, updatedAt } = await getContentfulContent();

  return {
    props: {
      terms,
      updatedAt,
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

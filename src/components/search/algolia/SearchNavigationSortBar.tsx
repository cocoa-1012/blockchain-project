import { InstantSearch, connectStats, Index } from 'react-instantsearch-dom';
import { StatsProvided } from 'react-instantsearch-core';
import { useRouter } from 'next/router';

import { css, styled } from 'stitches.config';

import { AlgoliaIndexName } from 'types/Algolia';

import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import SearchNavigationSortOptions from './SearchNavigationSortOptions';
import { Link } from 'components/links/Link';

import searchClient from 'lib/clients/algolia';
import { formatInteger } from 'utils/formatters';

type IndexCount = StatsProvided & {
  label: string;
  isActive: boolean;
};

const IndexCount = connectStats<IndexCount>((props) => {
  const { isActive } = props;

  return (
    <IndexTabContainer isActive={isActive}>
      <IndexTabLabel
        css={{
          marginRight: '$3',
          '@bp2': {
            marginRight: '$4',
          },
        }}
        isActive={isActive}
      >
        {props.label}
      </IndexTabLabel>
      <IndexTabLabel css={{ color: '$black60' }} isActive={isActive}>
        {formatInteger(props.nbHits)}
      </IndexTabLabel>
    </IndexTabContainer>
  );
});

interface IndexTabLinkProps {
  href: string;
  indexName: string;
  label: string;
  pathname: string;
}

function IndexTabLink(props: IndexTabLinkProps): JSX.Element {
  const { indexName, href, label, pathname } = props;
  return (
    <Index indexName={indexName}>
      <Link href={href}>
        <a style={{ textDecoration: 'none', display: 'block' }}>
          <IndexCount label={label} isActive={href === pathname} />
        </a>
      </Link>
    </Index>
  );
}

interface SearchNavigationSortBarProps {
  algoliaIndexes: AlgoliaIndexName[];
  defaultRefinement: string;
}

const headerStyles = css({
  display: 'none',
  '@bp1': {
    display: 'flex',
  },
})();

export default function SearchNavigationSortBar(
  props: SearchNavigationSortBarProps
): JSX.Element {
  const { algoliaIndexes, defaultRefinement } = props;

  const { pathname } = useRouter();

  return (
    <Flex
      css={{
        borderBottom: 'solid 1px $black10',
        justifyContent: 'space-between',
      }}
    >
      <Grid
        css={{
          gap: '$5',
          '@bp2': {
            gap: '$6',
          },
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <InstantSearch searchClient={searchClient} indexName="artworks">
          <IndexTabLink
            indexName="users"
            href="/profiles"
            label="Profiles"
            pathname={pathname}
          />
          <IndexTabLink
            indexName="artworks"
            href="/artworks"
            label="Artworks"
            pathname={pathname}
          />
        </InstantSearch>
      </Grid>
      <SearchNavigationSortOptions
        algoliaIndexes={algoliaIndexes}
        className={headerStyles}
        orientation="horizontal"
        defaultRefinement={defaultRefinement}
      />
    </Flex>
  );
}

const IndexTabContainer = styled(Flex, {
  marginBottom: -1,
  paddingBottom: '$6',
  borderBottom: 'solid 2px transparent',
  textDecoration: 'none',
  variants: {
    isActive: {
      true: {
        borderBottom: 'solid 2px $black100',
      },
    },
  },
});

const IndexTabLabel = styled(Text, {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
  color: '$black100',
  variants: {
    isActive: {
      true: {
        color: '$black100 !important',
      },
    },
  },
});

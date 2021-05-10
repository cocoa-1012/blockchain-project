import { connectHits } from 'react-instantsearch-dom';

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import SearchHitUser from '../SearchHitUser';
import SearchHitArtwork from '../SearchHitArtwork';

import { isEmptyOrNil } from 'utils/helpers';
import { AlgoliaArtwork, AlgoliaUser } from 'types/Algolia';

const SearchPaneHeading = styled(Text, {
  color: '$black50',
  fontSize: '$1',
  fontWeight: 'bold',
  fontFamily: '$body',
});

export const SearchResultsArtworks = connectHits<AlgoliaArtwork>(
  (props): JSX.Element => {
    const { hits } = props;

    const noResults = isEmptyOrNil(hits);

    if (noResults) {
      return null;
    }

    return (
      <Grid css={{ gap: '$2' }}>
        <SearchPaneHeading>Artworks</SearchPaneHeading>

        {hits.map((hit, index) => (
          <SearchHitArtwork key={index} hit={hit} />
        ))}
      </Grid>
    );
  }
);

export const SearchResultsUsers = connectHits<AlgoliaUser>(
  (props): JSX.Element => {
    const { hits } = props;

    const noResults = isEmptyOrNil(hits);

    if (noResults) {
      return null;
    }

    return (
      <Grid css={{ gap: '$2' }}>
        <SearchPaneHeading>People</SearchPaneHeading>

        {hits.map((hit, index) => (
          <SearchHitUser key={index} hit={hit} />
        ))}
      </Grid>
    );
  }
);

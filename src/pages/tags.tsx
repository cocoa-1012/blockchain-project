import { useMemo } from 'react';
import { cond, flatten, propOr, uniqBy, always, T } from 'ramda';
import { InfiniteData } from 'react-query';
import { useRouter } from 'next/router';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Paragraph from 'components/base/Paragraph';
import LoadingPage from 'components/LoadingPage';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import ArtworkCardV2 from 'components/cards/artwork/ArtworkCardV2';

import { styled } from 'stitches.config';

import useAuthToken from 'hooks/queries/use-auth-token';
import useArtworksByTags from 'hooks/queries/hasura/use-artworks-by-tags';
import { useArtworksByTagsCount } from 'graphql/hasura/queries/artworks-by-tags-count.generated';

import { ArtworkV2, BasicArtwork } from 'types/Artwork';

import { getFirstValue, isAnyTrue } from 'utils/helpers';

const CardGrid = styled(Grid, {
  gap: '$4',
  '@bp0': {
    gridTemplateColumns: 'repeat(2,1fr)',
  },
  '@bp1': {
    gap: '$6',
    gridTemplateColumns: 'repeat(3,1fr)',
  },
  '@bp3': {
    gap: '$7',
    gridTemplateColumns: 'repeat(4,1fr)',
  },
});

// TODO: put this into shared hook file
function useFlattenedResults<T extends BasicArtwork>(data: InfiniteData<T[]>) {
  return useMemo(
    () =>
      uniqBy(
        (artwork) => artwork.tokenId,
        flatten<T[]>(propOr<[], InfiniteData<T[]>, T[]>([], 'pages', data))
      ),
    [data]
  );
}

const TagsHeading = styled(Text, {
  fontSize: '$4',
  fontFamily: '$body',
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  marginBottom: '$8',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  '@bp2': {
    fontSize: '$8',
    marginBottom: '$9',
  },
});

const PageBody = styled(Body, {
  '@bp1': {
    paddingTop: '$8',
  },
});

export default function Tags(): JSX.Element {
  const { user, isLoading: userIsLoading } = useAuthToken();
  const router = useRouter();

  const tagQuery = getFirstValue(router.query.tags);

  const {
    data: tagArtworksData,
    isLoading: tagArtworksLoading,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useArtworksByTags({ tag: tagQuery });

  const { data: tagArtworksCountData, isLoading: tagArtworksCountLoading } =
    useArtworksByTagsCount({ tag: tagQuery }, { enabled: Boolean(tagQuery) });

  const artworksCount = tagArtworksCountData?.artworksCount?.aggregate?.count;
  const artworksWord = artworksCount === 1 ? 'artwork' : 'artworks';

  const artworks = useFlattenedResults<ArtworkV2>(tagArtworksData);

  const isLoading = isAnyTrue([
    !router.isReady,
    tagArtworksLoading,
    tagArtworksCountLoading,
    userIsLoading,
  ]);

  return (
    <Page title="Tags">
      <PageBody>
        {cond([
          [
            (isLoading) => isLoading === true,
            always(
              <PageBody>
                <LoadingPage />
              </PageBody>
            ),
          ],
          [
            T,
            () => (
              <>
                <Paragraph
                  css={{ fontWeight: 600, color: '$black60', lineHeight: 1 }}
                >
                  {artworksCount} {artworksWord}
                </Paragraph>
                <TagsHeading>{tagQuery}</TagsHeading>
                <CardGrid>
                  {artworks.map((artwork) => (
                    <ArtworkCardV2
                      key={artwork.tokenId}
                      artwork={artwork}
                      creator={artwork.creator}
                      isCurrentUserProfile={false}
                      currentUser={user}
                    />
                  ))}
                </CardGrid>
                <InfiniteScrollButton
                  handleNextPage={fetchNextPage}
                  isFetching={isFetching}
                  hasNextPage={hasNextPage}
                />
              </>
            ),
          ],
        ])(isLoading)}
      </PageBody>
    </Page>
  );
}

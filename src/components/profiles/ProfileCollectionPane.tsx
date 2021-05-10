import { useMemo } from 'react';
import { ClientError } from 'graphql-request';
import { flatten, propOr, uniqBy } from 'ramda';
import { useState } from 'react';
import {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQueryClient,
} from 'react-query';

import { useSetArtworkUserVisibility } from 'graphql/server/mutations/set-artwork-user-visibility.generated';

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Button from 'components/base/Button';
import LoadingPage from 'components/LoadingPage';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import ArtworkCardV2 from 'components/cards/artwork/ArtworkCardV2';
import ArtworkCardContainer from 'components/cards/artwork/subcomponents/ArtworkCardContainer';

import { ArtworkV2 } from 'types/Artwork';
import WalletUser from 'types/WalletUser';

type QueryHookOptions = UseInfiniteQueryOptions<
  ArtworkV2[],
  ClientError,
  ArtworkV2[]
>;

export interface ProfileCollectionPaneProps<T> {
  collectionQueryHook: (
    variables: T,
    options?: QueryHookOptions
  ) => UseInfiniteQueryResult<ArtworkV2[], ClientError>;
  variables: T;
  options?: QueryHookOptions;
  isCurrentUserProfile: boolean;
  currentUser: WalletUser;
  currentUserIsLoading: boolean;
  publicKey: string;
}

type DefaultRecord = Record<string, unknown>;

export default function ProfileCollectionPane<T extends DefaultRecord>(
  props: ProfileCollectionPaneProps<T>
): JSX.Element {
  const {
    collectionQueryHook,
    variables,
    isCurrentUserProfile,
    currentUser,
    options,
  } = props;

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch: refetchCollection,
  } = collectionQueryHook(variables, {
    ...options,
    refetchOnWindowFocus: false,
  });

  const setArtworkUserVisibility = useSetArtworkUserVisibility({
    onSuccess: () => {
      refetchCollection();
      queryClient.invalidateQueries('UserArtworksCounts');
    },
  });

  // const isExpanded = false;

  const flattenedResults = useMemo(
    () =>
      uniqBy(
        (artwork) => artwork.tokenId,
        flatten<ArtworkV2[]>(
          propOr<[], InfiniteData<ArtworkV2[]>, ArtworkV2[]>([], 'pages', data)
        )
      ),
    [data]
  );

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const expandCollection = () => {
    setIsExpanded(true);
  };

  const hasExpandableCollection = flattenedResults.length > 3;

  if (isLoading) {
    return (
      <Flex css={{ paddingTop: '$8' }}>
        <LoadingPage />
      </Flex>
    );
  }

  return (
    <>
      <Grid css={{ gap: '$4', '@bp1': { gap: '$6' } }}>
        <CardGrid isExpanded={isExpanded}>
          {flattenedResults.map((artwork) => (
            <ArtworkCardV2
              key={artwork.tokenId}
              artwork={artwork}
              creator={artwork.creator}
              isCurrentUserProfile={isCurrentUserProfile}
              setArtworkUserVisibility={setArtworkUserVisibility}
              currentUser={currentUser}
            />
          ))}
        </CardGrid>
        {hasExpandableCollection && !isExpanded && (
          <ExpandCollectionButton
            color="white"
            shape="round"
            size="regular"
            onClick={expandCollection}
          >
            View all
          </ExpandCollectionButton>
        )}
      </Grid>
      <InfiniteScrollButton
        handleNextPage={fetchNextPage}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
      />
    </>
  );
}

const ExpandCollectionButton = styled(Button, {
  width: '100%',
  display: 'block',
  '@bp1': {
    display: 'none',
  },
});

const CardGrid = styled(Grid, {
  gap: '$4',
  [`& ${ArtworkCardContainer}:nth-of-type(n+4)`]: {
    display: 'none',
  },
  '@bp1': {
    gap: '$6',
    gridTemplateColumns: 'repeat(2,1fr)',
    [`& ${ArtworkCardContainer}:nth-of-type(n+4)`]: {
      display: 'flex',
    },
  },
  '@bp3': {
    gap: '$7',
    gridTemplateColumns: 'repeat(3,1fr)',
  },
  variants: {
    isExpanded: {
      true: {
        [`& ${ArtworkCardContainer}:nth-of-type(n+4)`]: {
          display: 'flex',
        },
      },
    },
  },
});

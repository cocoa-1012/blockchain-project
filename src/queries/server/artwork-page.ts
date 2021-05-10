import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { useQuery, UseQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import { getTokenId, isValidUUID } from 'utils/products';
import { maybeGetAddress } from 'utils/users';
import { mergePercentSplitsWithUsers } from 'utils/split';
import { isNonZeroNumber } from 'utils/formatters';

import {
  getHasuraArtworkById,
  getHasuraArtworkByTokenId,
} from 'queries/hasura/artworks';
import { getArtworkPercentSplits } from 'queries/subgraph/artworks';
import { getHasuraUsers } from 'queries/hasura/users';

import Artwork, { BasicArtwork } from 'types/Artwork';
import { PercentSplitWithUsers } from 'types/Split';

interface ArtworkData {
  artwork: Artwork;
  percentSplits: PercentSplitWithUsers;
}

type ArtworkArgs = {
  slug: string;
};

type PageProps = GetStaticPropsContext<ArtworkArgs>;
type PageData = GetStaticPropsResult<ArtworkData>;

interface ArtworkByTokenIdVariables {
  tokenId: string;
}

export function useProfileArtworkByTokenId(
  variables: ArtworkByTokenIdVariables,
  options?: UseQueryOptions<BasicArtwork, ClientError>
) {
  return useQuery(
    ['HasuraArtworkByTokenId', variables],
    () => getHasuraArtworkByTokenId({ ...variables, excludeHidden: false }),
    options
  );
}

export async function getArtworkPageProps({
  params,
}: PageProps): Promise<PageData> {
  const { slug } = params;

  const isUUID = isValidUUID(slug);

  if (isUUID) {
    const artworkQuery = await getHasuraArtworkById(slug);
    return {
      props: {
        artwork: artworkQuery.artwork,
        percentSplits: null,
      },
      revalidate: 3,
    };
  }

  const tokenId: string = getTokenId(slug);
  const isValidTokenId = isNonZeroNumber(tokenId);

  const percentSplits = isValidTokenId ? await getPercentSplits(tokenId) : null;

  return {
    props: {
      percentSplits,
      artwork: await getHasuraArtworkByTokenId({
        tokenId,
        excludeHidden: false,
      }),
    },
    revalidate: 30,
  };
}

export async function getPercentSplits(
  tokenId: string
): Promise<PercentSplitWithUsers> {
  const percentSplit = await getArtworkPercentSplits(tokenId);

  if (percentSplit) {
    const splitUserPublicKeys = percentSplit.shares.map((share) =>
      maybeGetAddress(share.account.id)
    );

    const usersQuery = await getHasuraUsers({
      publicKeys: splitUserPublicKeys,
    });

    return mergePercentSplitsWithUsers(percentSplit, usersQuery.users);
  }

  return null;
}

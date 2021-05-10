/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import BurnTransactionSuccess from 'components/transactions/burn/BurnTransactionSuccess';
import BurnTransactionBurning from 'components/transactions/burn/BurnTransactionBurning';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';
import { useSubgraphArtworkByTokenIdWithPollingIncludingBurned } from 'hooks/queries/subgraph/use-artwork-by-token-id';

import { getFirstValue } from 'utils/helpers';
import { buildUserProfilePath } from 'utils/artwork/artwork';
import { getTokenId } from 'utils/products';
import { ZERO_ADDRESS } from 'lib/constants';
import useAuthToken from 'hooks/queries/use-auth-token';

BurnSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Burn',
});

export default function BurnSubmitted(): JSX.Element {
  const router = useRouter();
  const { user } = useAuthToken();

  const artworkSlug = getFirstValue(router.query.slug);
  const txHash = getFirstValue(router.query.txHash);

  const tokenId = getTokenId(artworkSlug);

  const { data: subgraphArtworkData, loading: isSubgraphArtworkLoading } =
    useSubgraphArtworkByTokenIdWithPollingIncludingBurned(tokenId);

  const nfts = subgraphArtworkData?.artworks;
  const firstNft = nfts ? nfts[0] : null;

  const isBurnedOnSubgraph: boolean = firstNft
    ? firstNft?.ownedOrListedBy?.id === ZERO_ADDRESS
    : false;

  const { data: artworkData, loading: isServerArtworkLoading } =
    useHasuraArtworkByTokenId({
      tokenId,
      skip: isBurnedOnSubgraph,
    });

  const artwork = artworkData?.artwork;
  const status = artwork?.status;

  const { data: userData } = useUserByPublicKey({
    publicKey: user?.publicAddress,
    refetchOnWindowFocus: false,
  });

  const profilePath = buildUserProfilePath({ user: userData?.user });

  if (
    !isBurnedOnSubgraph ||
    isServerArtworkLoading ||
    isSubgraphArtworkLoading
  ) {
    return <BurnTransactionBurning artwork={artwork} txHash={txHash} />;
  }

  return (
    <BurnTransactionSuccess
      artwork={artwork}
      txHash={txHash}
      status={status}
      profilePath={profilePath}
      isBurnedOnSubgraph={isBurnedOnSubgraph}
    />
  );
}

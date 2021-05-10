/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import UnlistTransactionSuccess from 'components/transactions/unlist/UnlistTransactionSuccess';
import UnlistTransactionUnlisting from 'components/transactions/unlist/UnlistTransactionUnlisting';

import { getFirstValue } from 'utils/helpers';

import { buildArtworkPath, buildUserProfilePath } from 'utils/artwork/artwork';
import { getTokenId } from 'utils/products';

import useSubgraphArtworkByTokenIdWithPolling from 'hooks/queries/subgraph/use-artwork-by-token-id';
import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';

import { getNFTMarketContractToRead } from 'lib/contracts';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

UnlistSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Unlist',
});

export default function UnlistSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const router = useRouter();

  const artworkSlug = getFirstValue(router.query.slug);
  const txHash = getFirstValue(router.query.txHash);

  const tokenId = getTokenId(artworkSlug);

  const [isEventEmitted, setIsEventEmitted] = useState(false);

  const { data: artworkData, loading: isServerArtworkLoading } =
    useHasuraArtworkByTokenId({ tokenId });

  const { data: subgraphArtworkData, loading: isSubgraphArtworkLoading } =
    useSubgraphArtworkByTokenIdWithPolling(tokenId);

  const nfts = subgraphArtworkData?.artworks;
  const firstNft = nfts ? nfts[0] : null;

  const mostRecentActiveAuction = firstNft?.mostRecentActiveAuction;
  const auctionId = mostRecentActiveAuction?.auctionId;
  const { provider, isLoading: isProviderLoading } = useReadOnlyProvider();

  const nftMarket = getNFTMarketContractToRead(provider);

  const { user: userAuthToken } = useAuthToken();
  const { data: bidderData, isLoading: bidderIsLoading } = useUserByPublicKey({
    publicKey: userAuthToken?.publicAddress,
    enabled: Boolean(userAuthToken?.publicAddress),
  });

  const user = bidderData?.user;

  const userProfilePath = buildUserProfilePath({ user });

  useEffect(() => {
    if (nftMarket && auctionId) {
      nftMarket.once(
        nftMarket.filters.ReserveAuctionCanceled(BigNumber.from(auctionId)),
        (auctionId, tx) => {
          // console.log(`Canceled ${auctionId} in ${tx?.transactionHash}`);
          setIsEventEmitted(true);
        }
      );
    }
  }, [auctionId, nftMarket]);

  const artwork = artworkData?.artwork;
  const status = artwork?.status;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });

  if (!isEventEmitted || isServerArtworkLoading || isSubgraphArtworkLoading) {
    return (
      <UnlistTransactionUnlisting txHash={txHash} artworkPath={artworkPath} />
    );
  }

  return (
    <UnlistTransactionSuccess
      txHash={txHash}
      status={status}
      profilePath={userProfilePath}
      isEventEmitted={isEventEmitted}
    />
  );
}

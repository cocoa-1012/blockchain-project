/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import ChangePriceTransactionSuccess from 'components/transactions/changePrice/ChangePriceTransactionSuccess';
import ChangePriceTransactionChangingPrice from 'components/transactions/changePrice/ChangePriceTransactionChangingPrice';

import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useSubgraphArtworkByTokenIdWithPolling from 'hooks/queries/subgraph/use-artwork-by-token-id';

import { getFirstValue } from 'utils/helpers';
import { buildArtworkPath, buildUserProfilePath } from 'utils/artwork/artwork';
import { getTokenId } from 'utils/products';

import { getNFTMarketContractToRead } from 'lib/contracts';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

ChangePriceSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Change Price',
});

export default function ChangePriceSubmitted(): JSX.Element {
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

  useEffect(() => {
    if (auctionId && nftMarket) {
      nftMarket.once(
        nftMarket.filters.ReserveAuctionUpdated(
          BigNumber.from(auctionId),
          null
        ),
        (auctionId, reservePrice, tx) => {
          setIsEventEmitted(true);
        }
      );
    }
  }, [auctionId, nftMarket]);

  const artwork = artworkData?.artwork;
  const status = artwork?.status;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });
  const { user: userAuthToken } = useAuthToken();
  const { data: bidderData, isLoading: bidderIsLoading } = useUserByPublicKey({
    publicKey: userAuthToken?.publicAddress,
    enabled: Boolean(userAuthToken?.publicAddress),
  });

  const user = bidderData?.user;

  const userProfilePath = buildUserProfilePath({ user });

  if (!isEventEmitted || isServerArtworkLoading || isSubgraphArtworkLoading) {
    return (
      <ChangePriceTransactionChangingPrice
        artwork={artwork}
        txHash={txHash}
        artworkPath={artworkPath}
      />
    );
  }

  return (
    <ChangePriceTransactionSuccess
      artwork={artwork}
      txHash={txHash}
      status={status}
      artworkPath={artworkPath}
      profilePath={userProfilePath}
      isEventEmitted={isEventEmitted}
    />
  );
}

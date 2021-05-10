/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ApproveTransactionSuccess from 'components/transactions/approve/ApproveTransactionSuccess';
import ApproveTransactionApproving from 'components/transactions/approve/ApproveTransactionApproving';
import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import { getFirstValue } from 'utils/helpers';
import { buildArtworkPath } from 'utils/artwork/artwork';
import { getTokenId } from 'utils/products';

import useSubgraphArtworkByTokenIdWithPolling from 'hooks/queries/subgraph/use-artwork-by-token-id';
import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useAuthToken from 'hooks/queries/use-auth-token';

import { getNFT721ContractToRead } from 'lib/contracts';
import { getNFTMarketAddress } from 'lib/addresses';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

ApproveSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Approve',
});

export default function ApproveSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const router = useRouter();

  const { user } = useAuthToken();

  const publicAddress = user?.publicAddress;

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

  const nftMarket = getNFT721ContractToRead(provider);
  const nftMarketAddr = getNFTMarketAddress();

  useEffect(() => {
    if (nftMarket && publicAddress && nftMarketAddr) {
      nftMarket.once(
        nftMarket.filters.ApprovalForAll(publicAddress, nftMarketAddr, null),
        (tx) => {
          setIsEventEmitted(true);
        }
      );
    }
  }, [nftMarket, nftMarketAddr, publicAddress]);

  const artwork = artworkData?.artwork;
  const status = artwork?.status;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });

  if (!isEventEmitted || isServerArtworkLoading || isSubgraphArtworkLoading) {
    return (
      <ApproveTransactionApproving
        artwork={artwork}
        txHash={txHash}
        artworkPath={artworkPath}
      />
    );
  }

  return (
    <ApproveTransactionSuccess
      artwork={artwork}
      txHash={txHash}
      status={status}
      artworkPath={artworkPath}
      isEventEmitted={isEventEmitted}
    />
  );
}

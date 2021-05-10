/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { WrappedTransactionLayout } from 'components/layouts/TransactionLayout';
import MintTransactionSuccess from 'components/transactions/mint/MintTransactionSuccess';
import MintMetadataSyncing from 'components/transactions/mint/MintMetadataSyncing';
import MintTransactionMinting from 'components/transactions/mint/MintTransactionMinting';

import { getNFT721ContractToRead } from 'lib/contracts';
import { POLL_INTERVAL_VIDEO, POLL_INTERVAL_TOKEN_ID } from 'lib/constants';

import { getFirstValue } from 'utils/helpers';

import useHasuraArtwork from 'hooks/queries/hasura/use-hasura-artwork';
import useAuthToken from 'hooks/queries/use-auth-token';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import { creatorFlowSteps } from 'components/transactions/navigationFlows';

MintSubmitted.getLayout = WrappedTransactionLayout({
  title: 'Mint',
  percentCompleted: 36.5,
  navigationSteps: creatorFlowSteps,
  bodyClass: 'creator-flow',
});

// Note: We need id (artwork table db primary key)
// in the route here so we know what to poll for a tokenId
// having been associated
// txHash won't work because the user might speed up the tx
// in MetaMask, and this flow started with artwork table id
// anyway, so we'll stick with that

export default function MintSubmitted(): JSX.Element {
  const router = useRouter();

  const artworkId = getFirstValue(router.query.id);
  const txHash = getFirstValue(router.query.txHash);
  const isSyncing = getFirstValue(router.query.syncing);

  const [isEventEmitted, setIsEventEmitted] = useState(false);

  const { provider, isLoading: isProviderLoading } = useReadOnlyProvider();
  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  // Poll for server artwork even if it's not a video
  // to see when tokenId shows up
  //
  // Because the polling interval for this purpose
  // is faster than the polling we would do
  // for a video, no need to conditionally poll if it's a video here
  // if it IS a video though we keep an eye on assetStatus to know whether to
  // render artwork with optimised video or not
  //
  // That logic is implemented in the artwork cards
  // themselves, though

  // TODO: Stop polling once we have tokenId
  const pollInterval = isEventEmitted
    ? POLL_INTERVAL_TOKEN_ID
    : POLL_INTERVAL_VIDEO;

  const {
    data: artworkData,
    loading: isServerArtworkLoading,
    refetch,
  } = useHasuraArtwork({ id: artworkId, pollInterval });

  const artwork = artworkData?.artwork;
  const tokenId = artwork?.tokenId;
  const tokenIPFSPath = artwork?.metadataIPFSPath;

  // refetch every time a tokenId isn’t present but only
  // after the event is emitted
  useEffect(() => {
    if (isEventEmitted && !tokenId) {
      refetch();
    }
  }, [isEventEmitted, tokenId, refetch]);

  const syncingMetadataPath = {
    pathname: router.pathname,
    query: { ...router.query, syncing: true },
  };

  const tagArtworkPath = tokenId
    ? `/creator/${artwork?.id}/tags`
    : syncingMetadataPath;

  useEffect(
    () => {
      if (tokenId && isSyncing) {
        router.push(tagArtworkPath);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokenId, tagArtworkPath, isSyncing]
  );

  const nftMarket = getNFT721ContractToRead(provider);

  useEffect(() => {
    if (nftMarket && publicAddress && tokenIPFSPath) {
      nftMarket.once(
        nftMarket.filters.Minted(publicAddress, null, tokenIPFSPath, null),
        (creator, tokenId, indexedTokenIPFSPath, tokenIPFSPath, tx) => {
          // console.log(
          //   `Minted ${tokenId} and sent to ${creator} with ${tokenIPFSPath} in ${tx?.transactionHash}`
          // );
          setIsEventEmitted(true);
        }
      );
    }
  }, [nftMarket, publicAddress, tokenIPFSPath]);

  if (isSyncing) {
    return <MintMetadataSyncing artwork={artwork} txHash={txHash} />;
  }

  if (isEventEmitted || tokenId) {
    return (
      <MintTransactionSuccess
        artwork={artwork}
        txHash={txHash}
        tokenId={tokenId}
        tagArtworkPath={tagArtworkPath}
        isEventEmitted={isEventEmitted}
      />
    );
  }

  if (!isEventEmitted || isServerArtworkLoading) {
    return <MintTransactionMinting artwork={artwork} txHash={txHash} />;
  }

  return <Text>Unhandled case</Text>;
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import TransferTransactionSuccess from 'components/transactions/transfer/TransferTransactionSuccess';
import TransferTransactionTransferring from 'components/transactions/transfer/TransferTransactionTransferring';

import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useAuthToken from 'hooks/queries/use-auth-token';

import { getFirstValue } from 'utils/helpers';
import { buildArtworkPath } from 'utils/artwork/artwork';
import { getTokenId } from 'utils/products';

import { getNFT721ContractToRead } from 'lib/contracts';

import Artwork from 'types/Artwork';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

const getPageTitle = (artwork: Artwork) =>
  artwork ? `Transfer ${artwork.name}` : 'Transfer';

TransferSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Transfer',
  buildTitle: getPageTitle,
});

export default function TransferSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const router = useRouter();

  const artworkSlug = getFirstValue(router.query.slug);
  const txHash = getFirstValue(router.query.txHash);

  const tokenId = getTokenId(artworkSlug);

  const { data: artworkData } = useHasuraArtworkByTokenId({ tokenId });

  const [isEventEmitted, setIsEventEmitted] = useState<boolean>(false);

  const { provider, isLoading: isProviderLoading } = useReadOnlyProvider();
  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const artwork = artworkData?.artwork;
  const status = artwork?.status;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });

  const nftMarket = getNFT721ContractToRead(provider);

  useEffect(() => {
    if (nftMarket && publicAddress) {
      nftMarket.once(
        nftMarket.filters.Transfer(publicAddress, null, null),
        (from, to, tokenId, tx) => {
          setIsEventEmitted(true);
        }
      );
    }
  }, [nftMarket, publicAddress]);

  if (!isEventEmitted) {
    return (
      <TransferTransactionTransferring artwork={artwork} txHash={txHash} />
    );
  }

  return (
    <TransferTransactionSuccess
      artwork={artwork}
      txHash={txHash}
      status={status}
      artworkPath={artworkPath}
    />
  );
}

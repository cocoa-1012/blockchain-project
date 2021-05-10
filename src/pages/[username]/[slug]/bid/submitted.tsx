/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { useRouter } from 'next/router';
import { any } from 'ramda';
import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import { useSubgraphArtworkByTokenId } from 'hooks/queries/subgraph/use-artwork-by-token-id';

import TransactionContent from 'components/transactions/TransactionContent';
import TransactionPendingState from 'components/transactions/TransactionPendingState';
import SpinnerStroked from 'components/SpinnerStroked';
import MetaMaskError from 'components/auth/MetaMaskError';
import BidSubmittedActions from 'components/transactions/bid/BidSubmittedActions';
import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import { getFirstValue } from 'utils/helpers';
import { getTokenId } from 'utils/products';

import { getNFTMarketContractToRead } from 'lib/contracts';
import { mobileAlignCenter } from 'components/transactions/styles';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

BidSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Bid Submitted',
});

export default function BidSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const { data: serverUserData, isLoading: serverUserLoading } =
    useUserByPublicKey({
      publicKey: publicAddress,
      refetchOnWindowFocus: false,
    });

  const [isEventEmitted, setIsEventEmitted] = useState<boolean>(false);

  const router = useRouter();

  const artworkSlug: string = getFirstValue(router.query.slug);
  const tokenId: string = getTokenId(artworkSlug);
  const txHash = getFirstValue(router.query.txHash);

  const { data: subgraphArtworkData, loading: isSubgraphArtworkLoading } =
    useSubgraphArtworkByTokenId(tokenId);

  const serverUser = serverUserData?.user;

  const { isWrongNetwork } = useIsWrongNetwork();

  const loadingStates = [
    isUserLoading,
    serverUserLoading,
    !user,
    isSubgraphArtworkLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  const { provider } = useReadOnlyProvider();

  const nftMarket = getNFTMarketContractToRead(provider);

  const firstNft = getFirstValue(subgraphArtworkData?.artworks);

  const mostRecentActiveAuction = firstNft?.mostRecentActiveAuction;
  const auctionId = mostRecentActiveAuction?.auctionId;

  useEffect(() => {
    if (nftMarket && auctionId) {
      nftMarket.once(
        nftMarket.filters.ReserveAuctionBidPlaced(
          BigNumber.from(auctionId),
          null,
          null,
          null
        ),
        () => {
          setIsEventEmitted(true);
        }
      );
    }
  }, [nftMarket, auctionId]);

  if (isWrongNetwork) {
    return <MetaMaskError />;
  }

  if (!isEventEmitted || isLoading) {
    return (
      <TransactionContent
        title="Your bid has been submitted."
        description="Your bid is being confirmed on the Ethereum blockchain. You’re free to leave this page if you like."
      >
        <TransactionPendingState txHash={txHash} />
      </TransactionContent>
    );
  }

  return (
    <TransactionContent
      title="Your bid was placed successfully."
      description="Your bid was confirmed on the Ethereum network. Please keep an eye on this auction in case someone outbids you before it’s over."
    >
      {serverUserLoading ? (
        <Flex sx={mobileAlignCenter}>
          <SpinnerStroked />
        </Flex>
      ) : (
        <BidSubmittedActions
          user={serverUser}
          token={user?.token}
          publicAddress={user?.publicAddress}
        />
      )}
    </TransactionContent>
  );
}

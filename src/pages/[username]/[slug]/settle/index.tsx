/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { any } from 'ramda';

import useArtworkByTokenId from 'hooks/queries/use-artwork-by-token-id';
import useAuthToken from 'hooks/queries/use-auth-token';

import SettleContainer from 'components/transactions/settle/SettleContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

import { getTokenId } from 'utils/products';
import { getFirstValue } from 'utils/helpers';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

SettleIndex.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Settle auction',
});

export default function SettleIndex(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const router = useRouter();
  const { user, isLoading: isUserLoading } = useAuthToken();

  const slug = getFirstValue(router.query.slug);

  const tokenId = getTokenId(slug);

  const publicAddress = user?.publicAddress;

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByTokenId({
      tokenId,
    });

  const loadingStates = [isArtworkLoading, isUserLoading];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <SettleContainer
      artwork={artworkData}
      auction={artworkData?.mostRecentActiveAuction}
      publicAddress={publicAddress}
    />
  );
}

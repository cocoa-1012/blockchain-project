/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { any } from 'ramda';
import { useState } from 'react';

import useArtworkHistory from 'hooks/queries/subgraph/use-artwork-history';
import useBalance from 'hooks/queries/use-balance';
import useAuthToken from 'hooks/queries/use-auth-token';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';
import { useHasuraArtworkByTokenId } from 'hooks/queries/server/use-server-artwork';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import BidContainer from 'components/transactions/bid/BidContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import renderArtworkWarningBlock from 'components/trust-safety/ArtworkWarningBlock';

import { getTokenId } from 'utils/products';
import { getFirstValue } from 'utils/helpers';
import { isArtworkOrCreatorModerated } from 'utils/moderation';

import { ALL_ARTWORK_MODERATION_STATUSES } from 'lib/constants';
import Artwork from 'types/Artwork';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

const getPageTitle = (artwork: Artwork) =>
  artwork ? `Bid on ${artwork.name}` : 'Bid on';

BidIndex.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Bid on',
  buildTitle: getPageTitle,
});

export default function BidIndex(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const router = useRouter();

  const { user, isLoading: isUserLoading } = useAuthToken();

  const [resetKey, setResetKey] = useState(Date.now());

  const { data: balance, isLoading: balanceLoading } = useBalance();

  const artworkSlug = getFirstValue(router.query.slug);

  const tokenId = getTokenId(artworkSlug);

  const { data: artworkData, isLoading: isArtworkLoading } = useArtworkHistory({
    tokenId,
  });

  const artwork = artworkData?.nft;

  const auctionId = artwork?.mostRecentActiveAuction?.auctionId;

  const { data: serverArtworkData, loading: serverArtworkLoading } =
    useHasuraArtworkByTokenId({
      tokenId,
      moderationStatuses: ALL_ARTWORK_MODERATION_STATUSES,
    });

  const creatorPublicKey = artwork?.creator?.id;

  const {
    data: socialVerificationsData,
    isLoading: isSocialVerificationsLoading,
  } = useSocialVerifications({
    publicKey: creatorPublicKey,
  });

  const socialVerifications =
    socialVerificationsData?.socialVerifications ?? [];

  const serverArtwork = serverArtworkData?.artwork;

  const { isModerated } = isArtworkOrCreatorModerated(serverArtwork);

  const loadingStates = [
    balanceLoading,
    isArtworkLoading,
    serverArtworkLoading,
    isUserLoading,
    isSocialVerificationsLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isModerated) {
    return renderArtworkWarningBlock(artwork);
  }

  return (
    <BidContainer
      key={resetKey}
      artwork={artwork}
      balance={balance}
      socialVerifications={socialVerifications}
      auctionId={auctionId}
      user={user}
      resetTransaction={() => {
        setResetKey(Date.now());
      }}
    />
  );
}

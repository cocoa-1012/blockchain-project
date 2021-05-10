import { css } from 'stitches.config';

import MasonryGrid from 'components/MasonryGrid';
import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import ArtworkCardNoEvent from 'components/cards/artworkV2/ArtwordCardNoEvent';
import { areKeysEqual } from 'utils/users';

import Artwork, { ArtworkWithEvent } from 'types/Artwork';
import Account from 'types/Account';
import useApproval from 'hooks/queries/subgraph/use-approval';
import { notEmptyOrNil } from 'utils/helpers';

interface MasonryGridRenderProps {
  artwork: ArtworkWithEvent;
  publicAddress?: string;
  currentUser?: Account;
  users: Account[];
}

interface FeaturedCreatorsArtworks {
  artworks: Artwork[];
  users: Account[];
}

// TODO: Remove !important when ArtwordCardNoEvent is using stitches
const artworkdCardStyles = css({ marginBottom: '$6 !important' })();

export default function FeaturedCreatorsArtworks(
  props: FeaturedCreatorsArtworks
): JSX.Element {
  const { artworks, users } = props;

  const { user, isLoading } = useAuthToken();
  const publicAddress = user?.publicAddress;

  const { data: currentUserData } = useUserByPublicKey({
    publicKey: publicAddress,
    refetchOnWindowFocus: false,
  });

  const { data: approvalData } = useApproval({
    publicKey: currentUserData?.user?.publicKey,
  });

  const hasApprovedMarketContract = notEmptyOrNil(
    approvalData?.account?.nftAccountApprovals
  );

  return (
    <MasonryGrid isLoading={isLoading} artworks={artworks}>
      {(props: MasonryGridRenderProps) => (
        <ArtworkCardNoEvent
          artwork={props.artwork}
          event={props.artwork.event}
          creator={props.artwork?.creator}
          isOwner={areKeysEqual([
            publicAddress,
            props.artwork?.ownedOrListedBy?.id,
          ])}
          currentUser={currentUserData?.user}
          mostRecentActiveAuction={props.artwork?.mostRecentActiveAuction}
          users={users}
          hasApprovedMarketContract={hasApprovedMarketContract}
          className={artworkdCardStyles}
        />
      )}
    </MasonryGrid>
  );
}

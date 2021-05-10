/* eslint-disable react/jsx-max-depth */
import { UseMutationResult } from 'react-query';
import { VideoAssetQuality } from 'types/Assets';
import { ArtworkV2 } from 'types/Artwork';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import {
  SetArtworkUserVisibility,
  SetArtworkUserVisibilityVariables,
} from 'graphql/server/mutations/set-artwork-user-visibility.generated';

import { css, styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Link from 'components/links/Link';
import UserTagRaw from 'components/users/UserTagRaw';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import ArtworkCardTitle from 'components/cards/artwork/subcomponents/ArtworkCardTitle';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';
import ArtworkCardContainer from 'components/cards/artwork/subcomponents/ArtworkCardContainer';
import ArtworkCardPopoverOwnerV2 from 'components/cards/artwork/subcomponents/popovers/ArtworkCardPopoverOwnerV2';
import ArtworkCardHeader from 'components/cards/artwork/subcomponents/ArtworkCardHeader';
import ArtworkCardMeta from 'components/cards/artwork/subcomponents/ArtworkCardMeta';
import FollowPopover from 'components/follows/FollowPopover';
import CardContextProvider, {
  useCardContext,
} from 'components/cards/CardContext';
import ArtworkCardSplitsLabel from './subcomponents/ArtworkCardSplitsLabel';

import {
  buildArtworkPath,
  buildUserProfilePath,
  getComputedArtworkStatusV2,
} from 'utils/artwork/artwork';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { isAllTrue, publicKeyOrIdOrAddress } from 'utils/helpers';
import { areKeysEqual } from 'utils/users';
import {
  getLatestArtworkEvent,
  getMostRecentAuction,
} from 'utils/auctions/auctions';

import WalletUser from 'types/WalletUser';

const pinnedLabelStyles = css({
  position: 'absolute',
  left: '$5',
  bottom: '$5',
})();

export default function ArtworkCardV2Context(
  props: ArtworkCardV2Props
): JSX.Element {
  return (
    <CardContextProvider>
      <ArtworkCardV2 {...props} />
    </CardContextProvider>
  );
}

interface ArtworkCardV2Props {
  artwork: ArtworkV2;
  creator: UserFragment;
  currentUser: WalletUser;
  // optionals
  isCurrentUserProfile?: boolean;
  setArtworkUserVisibility?: UseMutationResult<
    SetArtworkUserVisibility,
    Error,
    SetArtworkUserVisibilityVariables
  >;
}

export function ArtworkCardV2(props: ArtworkCardV2Props): JSX.Element {
  const {
    artwork,
    creator,
    currentUser,
    isCurrentUserProfile = false,
    setArtworkUserVisibility,
  } = props;

  const { isHovered, setIsHovered } = useCardContext();

  if (!artwork) {
    return <ArtworkCardSkeleton />;
  }

  const artworkPath = buildArtworkPath({ user: creator, artwork });

  const profilePath = buildUserProfilePath({ user: creator });

  const assetUrl = buildArtworkAssetUrl(
    { h: 640, q: 80, quality: VideoAssetQuality.Preview },
    artwork
  );

  const posterUrl = buildPosterUrl(artwork);

  const mostRecentActiveAuction = getMostRecentAuction(artwork);

  const hasSplits = artwork?.splitRecipients?.aggregate?.count > 0;

  const isCreatorOwner = areKeysEqual([
    artwork?.ownerPublicKey,
    artwork?.publicKey,
  ]);

  const computedArtworkStatus = getComputedArtworkStatusV2({
    mostRecentActiveAuction,
    latestArtworkEvent: getLatestArtworkEvent(artwork),
    currentUser,
    isCreatorOwner,
  });

  const isOwner = areKeysEqual([
    currentUser?.publicAddress,
    artwork?.ownerPublicKey,
  ]);

  const isOwnerOnProfile = isAllTrue([isCurrentUserProfile, isOwner]);

  return (
    <ArtworkCardContainer isHovered={isHovered} className="artwork-card">
      <Link href={artworkPath}>
        <StyledLink>{artwork.name}</StyledLink>
      </Link>
      <Box css={{ position: 'relative' }}>
        <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
        {hasSplits && <ArtworkCardSplitsLabel className={pinnedLabelStyles} />}
      </Box>

      <Flex css={{ flex: 1, alignItems: 'flex-start' }}>
        <ArtworkCardHeader>
          <Flex css={{ justifyContent: 'space-between' }}>
            <ArtworkCardTitle>{artwork.name}</ArtworkCardTitle>
            {isCurrentUserProfile && (
              <ArtworkCardPopoverOwnerV2
                artwork={artwork}
                status={computedArtworkStatus}
                currentUser={currentUser}
                setArtworkUserVisibility={setArtworkUserVisibility}
                setIsHovered={setIsHovered}
              />
            )}
          </Flex>

          <Flex css={{ position: 'relative', zIndex: 2 }}>
            <FollowPopover publicKey={publicKeyOrIdOrAddress(creator)}>
              <Link href={profilePath}>
                <UserTagLink>
                  <UserTagRaw user={creator} color="currentColor" />
                </UserTagLink>
              </Link>
            </FollowPopover>
          </Flex>
        </ArtworkCardHeader>
      </Flex>

      <Flex
        css={{ flexDirection: 'column' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ArtworkCardMeta
          artwork={artwork}
          mostRecentActiveAuction={mostRecentActiveAuction}
          isOwnerOnProfile={isOwnerOnProfile}
          status={computedArtworkStatus}
        />
      </Flex>
    </ArtworkCardContainer>
  );
}

const UserTagLink = styled('a', {
  textDecoration: 'none',
  color: '$black100',
  '& .username-tag': {
    fontSize: '$2',
    color: '$black60',
    transition: 'color $0 ease',
  },
  '&:hover .username-tag': {
    color: '$black100',
  },
});

const StyledLink = styled('a', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2,
  textIndent: '-9999rem',
});

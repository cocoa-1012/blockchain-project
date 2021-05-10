import { VideoAssetQuality } from 'types/Assets';
import { AlgoliaArtwork } from 'types/Algolia';

import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Link from 'components/links/Link';
import UserTagRaw from 'components/users/UserTagRaw';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import ArtworkCardTitle from 'components/cards/artwork/subcomponents/ArtworkCardTitle';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';
import ArtworkCardSearchPrices from 'components/cards/artwork/subcomponents/ArtworkCardSearchPrices';
import FollowPopover from 'components/follows/FollowPopover';
import CardContextProvider, {
  useCardContext,
} from 'components/cards/CardContext';
import ArtworkCardContainer from './subcomponents/ArtworkCardContainer';
import ArtworkCardHeader from './subcomponents/ArtworkCardHeader';

import { buildArtworkPath, buildUserProfilePath } from 'utils/artwork/artwork';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { publicKeyOrIdOrAddress } from 'utils/helpers';

export default function ArtworkCardWithContext(
  props: ArtworkCardSearchProps
): JSX.Element {
  return (
    <CardContextProvider>
      <ArtworkCardSearch {...props} />
    </CardContextProvider>
  );
}

interface ArtworkCardSearchProps {
  artwork: AlgoliaArtwork;
}

export function ArtworkCardSearch(props: ArtworkCardSearchProps): JSX.Element {
  const { artwork } = props;

  const { creator, auction } = artwork;

  const { isHovered } = useCardContext();

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

  return (
    <ArtworkCardContainer isHovered={isHovered} className="artwork-card">
      <Link href={artworkPath}>
        <StyledLink>{artwork.name}</StyledLink>
      </Link>
      <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />

      <ArtworkCardHeader>
        <Flex>
          <ArtworkCardTitle>{artwork.name}</ArtworkCardTitle>
        </Flex>

        <Flex css={{ marginTop: 'auto', position: 'relative', zIndex: 2 }}>
          <FollowPopover publicKey={publicKeyOrIdOrAddress(creator)}>
            <Link href={profilePath}>
              <UserTagLink>
                <UserTagRaw user={creator} color="currentColor" />
              </UserTagLink>
            </Link>
          </FollowPopover>
        </Flex>
      </ArtworkCardHeader>

      <Flex css={{ flexDirection: 'column', borderTop: 'solid 1px $black5' }}>
        <ArtworkCardSearchPrices auction={auction} artwork={artwork} />
      </Flex>
    </ArtworkCardContainer>
  );
}

const UserTagLink = styled('a', {
  textDecoration: 'none',
  color: '$black100',
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

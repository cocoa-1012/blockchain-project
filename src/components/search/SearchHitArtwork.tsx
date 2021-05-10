import Grid from 'components/base/Grid';

import SearchResultHeading from './search-result/SearchResultHeading';
import SearchResultSubheading from './search-result/SearchResultSubheading';
import SearchResultLink from './search-result/SearchResultLink';
import SearchResultAvatar from './search-result/SearchResultAvatar';
import Link from 'components/links/Link';

import type { AlgoliaArtwork, Hit } from 'types/Algolia';
import type Account from 'types/Account';
import type Artwork from 'types/Artwork';

import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { buildAssetStaticImage } from 'utils/assets';
import { buildArtworkPath } from 'utils/artwork/artwork';
import { ArtworkAssetFields, BasicArtwork } from 'types/Artwork';

interface SearchHitArtworkProps {
  hit: AlgoliaArtwork;
}

export default function SearchHitArtwork(
  props: SearchHitArtworkProps
): JSX.Element {
  const { hit } = props;

  const user: Account = {
    publicKey: hit.creator.publicKey,
    username: hit.creator.username,
  };

  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);
  const userHasUsername = hasUsername(user);

  const asset: ArtworkAssetFields = {
    id: hit.id,
    tokenId: hit.tokenId,
    name: hit.name,
    assetIPFSPath: hit.assetIPFSPath,
    assetId: hit.assetId,
    assetStatus: hit.assetStatus,
    mimeType: hit.mimeType,
  };

  const creator: Account = {
    publicKey: hit.creator.publicKey,
    username: hit.creator.username,
  };

  const assetPreviewUrl = buildAssetStaticImage({ w: 480, fm: 'jpg' }, asset);

  return (
    <Link href={buildArtworkPath({ artwork: asset, user: creator })}>
      <SearchResultLink as="a" size={{ '@bp2': 'large' }}>
        <SearchResultAvatar
          size={{ '@bp3': 'large' }}
          style={{ backgroundImage: `url(${assetPreviewUrl})` }}
          css={{ backgroundColor: '$black5' }}
        />
        <Grid css={{ alignItems: 'center', gap: '$1' }}>
          <SearchResultHeading
            tracking="tight"
            leading="tight"
            size={{ '@bp3': 'large' }}
          >
            {hit.name}
          </SearchResultHeading>
          <SearchResultSubheading isMono={!userHasUsername}>
            {usernameOrTruncatedAddress}
          </SearchResultSubheading>
        </Grid>
      </SearchResultLink>
    </Link>
  );
}

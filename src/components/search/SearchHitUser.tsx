import CircleAvatar from 'components/avatars/CircleAvatar';
import Grid from 'components/base/Grid';

import SearchResultHeading from './search-result/SearchResultHeading';
import SearchResultSubheading from './search-result/SearchResultSubheading';
import SearchResultLink from './search-result/SearchResultLink';
import SearchResultAvatar from './search-result/SearchResultAvatar';
import Link from 'components/links/Link';

import type { AlgoliaUser } from 'types/Algolia';
import type Account from 'types/Account';

import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { buildUserProfilePath } from 'utils/artwork/artwork';

interface SearchHitUserProps {
  hit: AlgoliaUser;
}

export default function SearchHitUser(props: SearchHitUserProps): JSX.Element {
  const { hit } = props;

  const user: Account = {
    publicKey: hit.publicKey,
    username: hit.username,
    name: hit.name,
  };

  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);
  const userHasUsername = hasUsername(hit);
  const userFullName = hit.name;

  return (
    <Link href={buildUserProfilePath({ user })}>
      <SearchResultLink as="a" size={{ '@bp2': 'large' }}>
        <SearchResultAvatar size={{ '@bp3': 'large' }}>
          <CircleAvatar
            size={[32, null, null, null, 50]}
            userIndex={hit.userIndex}
            imageUrl={hit.profileImageUrl}
          />
        </SearchResultAvatar>

        <Grid css={{ alignItems: 'center', gap: '$1' }}>
          {userFullName && (
            <SearchResultHeading
              tracking="tight"
              leading="tight"
              size={{ '@bp3': 'large' }}
            >
              {userFullName}
            </SearchResultHeading>
          )}
          <SearchResultSubheading isMono={!userHasUsername}>
            {usernameOrTruncatedAddress}
          </SearchResultSubheading>
        </Grid>
      </SearchResultLink>
    </Link>
  );
}

import CircleAvatar from 'components/avatars/CircleAvatar';
import Grid from 'components/base/Grid';

import SearchResultHeading from './search-result/SearchResultHeading';
import SearchResultSubheading from './search-result/SearchResultSubheading';
import SearchResultLink from './search-result/SearchResultLink';
import SearchResultAvatar from './search-result/SearchResultAvatar';

import type { AlgoliaUser } from 'types/Algolia';
import type Account from 'types/Account';

import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';

interface SearchHitSplitUserProps {
  hit: AlgoliaUser;
}

export default function SearchHitSplitUser(
  props: SearchHitSplitUserProps
): JSX.Element {
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
    <SearchResultLink>
      <SearchResultAvatar>
        <CircleAvatar
          size={32}
          userIndex={hit.userIndex}
          imageUrl={hit.profileImageUrl}
        />
      </SearchResultAvatar>

      <Grid css={{ alignItems: 'center', gap: '$1' }}>
        {userFullName && (
          <SearchResultHeading tracking="tight" leading="tight">
            {userFullName}
          </SearchResultHeading>
        )}
        <SearchResultSubheading isMono={!userHasUsername}>
          {usernameOrTruncatedAddress}
        </SearchResultSubheading>
      </Grid>
    </SearchResultLink>
  );
}

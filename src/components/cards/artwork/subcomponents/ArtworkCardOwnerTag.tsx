import CircleAvatar from 'components/avatars/CircleAvatar';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Link from 'components/links/Link';

import { styled } from 'stitches.config';

import { UserLight } from 'types/Account';

import {
  getUsernameOrAddress,
  getUsernameOrTruncatedAddress,
  hasUsername,
} from 'utils/helpers';

interface ArtworkCardOwnerTagProps {
  user: UserLight;
  href: string;
}

export default function ArtworkCardOwnerTag(
  props: ArtworkCardOwnerTagProps
): JSX.Element {
  const { user, href } = props;
  return (
    <Link href={href}>
      <ArtworkCardOwnerContainer as="a">
        <CircleAvatar
          size={22}
          imageUrl={user?.profileImageUrl}
          userIndex={user?.userIndex}
        />
        <ArtworkCardOwnerName noUsername={!hasUsername(user)}>
          {getUsernameOrTruncatedAddress(user)}
        </ArtworkCardOwnerName>
      </ArtworkCardOwnerContainer>
    </Link>
  );
}

const ArtworkCardOwnerName = styled(Text, {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  marginLeft: '$2',
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$2',
  color: '$black60',
  whiteSpace: 'nowrap',
  transition: 'color $0 ease',

  variants: {
    noUsername: {
      true: {
        fontFamily: '$mono',
        fontSize: '$1',
        fontWeight: 400,
        letterSpacing: '0.02em',
      },
    },
  },
});

const ArtworkCardOwnerContainer = styled(Flex, {
  textDecoration: 'none',
  maxWidth: '100%',
  overflow: 'hidden',
  '@media (hover: hover)': {
    [`&:hover ${ArtworkCardOwnerName}`]: {
      color: '$black100',
    },
  },
});

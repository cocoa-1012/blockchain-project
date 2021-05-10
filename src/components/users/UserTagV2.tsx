import { styled } from 'stitches.config';

import { notEmptyOrNil, truncateAddress } from 'utils/helpers';

import Account from 'types/Account';

import UserTagContainer from 'components/users/UserTagContainerV2';
import UserTagSkeletonV2 from 'components/users/UserTagSkeletonV2';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';

const UserTagUsername = styled(Text, {
  fontFamily: '$body',
  fontSize: '$1',
  fontWeight: 600,
  lineHeight: 1.4,
});

const UserTagAddress = styled(Text, {
  fontFamily: '$mono',
  fontSize: 12,
  lineHeight: 1.4,
  letterSpacing: '0.05em',
});

interface UserTagV2Props {
  user: Account;
  isLoading: boolean;
  hoverable?: boolean;
}

export default function UserTagV2(props: UserTagV2Props): JSX.Element {
  const { user, isLoading, hoverable = false } = props;

  if (isLoading) {
    return <UserTagSkeletonV2 />;
  }

  const hasUsername = notEmptyOrNil(user?.username);

  return (
    <UserTagContainer css={{ color: '$black100' }} hoverable={hoverable}>
      <CircleAvatar
        userIndex={user?.userIndex}
        imageUrl={user?.profileImageUrl}
        size={32}
      />
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '$2',
        }}
      >
        {hasUsername && <UserTagUsername>{user.username}</UserTagUsername>}
        <UserTagAddress>
          {truncateAddress({ address: user.publicKey, numberOfChars: 4 })}
        </UserTagAddress>
      </Flex>
    </UserTagContainer>
  );
}

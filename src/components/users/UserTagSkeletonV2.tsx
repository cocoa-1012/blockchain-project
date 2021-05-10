import { styled } from 'stitches.config';

import UserTagContainer from 'components/users/UserTagContainerV2';
import Box from 'components/base/Box';

const UserTagAvatarSkeleton = styled(Box, {
  width: 32,
  height: 32,
  backgroundColor: '$black5',
  borderRadius: '$round',
  marginRight: '$2',
});

const UserTagUsernameSkeleton = styled(Box, {
  backgroundColor: '$black5',
  height: 22,
  width: 120,
  borderRadius: '$1',
});

export default function UserTagSkeletonV2(): JSX.Element {
  return (
    <UserTagContainer css={{ minHeight: 52, minWidth: 210 }}>
      <UserTagAvatarSkeleton />
      <UserTagUsernameSkeleton />
    </UserTagContainer>
  );
}

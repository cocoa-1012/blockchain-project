import { styled } from 'stitches.config';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import FollowPopover from 'components/follows/FollowPopover';
import UserTag from 'components/users/UserTag';

const Heading = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$3',
  textAlign: 'center',
  letterSpacing: -0.2,
  marginBottom: '$8',
});

interface ProfileMigratedProps {
  migratedAddress: string;
}

export default function ProfileMigrated(
  props: ProfileMigratedProps
): JSX.Element {
  const { migratedAddress } = props;

  const { data: userData, isLoading: isUserLoading } = useUserByPublicKey({
    publicKey: migratedAddress,
    refetchOnWindowFocus: false,
  });

  return (
    <Box css={{ position: 'relative', zIndex: 10 }}>
      <Flex
        css={{
          paddingTop: '$11',
          paddingBottom: '$10',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          maxWidth: 640,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Heading>
          This creator has migrated their profile to a new account.
        </Heading>
        {!isUserLoading && (
          <FollowPopover publicKey={migratedAddress}>
            <UserTag user={userData?.user} />
          </FollowPopover>
        )}
      </Flex>
    </Box>
  );
}

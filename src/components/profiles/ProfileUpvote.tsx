import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import ProfileSectionHeading from './ProfileSectionHeading';
import WaitlistButtonWithLoading from 'components/waitlist/WaitlistButtonWithLoading';

import useUsedWaitlistVotes from 'hooks/queries/hasura/use-used-waitlist-votes';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';

import Account from 'types/Account';
import WalletUser from 'types/WalletUser';

import { getWaitlistVoteInfo } from 'utils/waitlist';
import { areKeysEqual } from 'utils/users';
import { notEmptyOrNil } from 'utils/helpers';

const TOTAL_VOTES = 5;

interface ProfileUpvoteProps {
  currentUser: WalletUser;
  user: Account;
}

export default function ProfileUpvote(props: ProfileUpvoteProps): JSX.Element {
  const { currentUser, user } = props;

  const currentUserPublicAddress = currentUser?.publicAddress;
  const authToken = currentUser?.token;

  const isMyProfile = areKeysEqual([user?.publicKey, currentUserPublicAddress]);

  const { data: usedVotesData, isLoading: isLoadingUsedVotes } =
    useUsedWaitlistVotes({
      publicKey: currentUserPublicAddress,
    });

  const { remainingVotesCount } = getWaitlistVoteInfo({
    usedVotesData,
    user,
    currentUser: currentUser,
  });

  const { data } = useSocialVerifications({
    publicKey: currentUserPublicAddress,
  });

  const isCurrentUserVerified = notEmptyOrNil(data?.socialVerifications);

  return (
    <Box>
      <ProfileSectionHeading>Community Upvote</ProfileSectionHeading>
      <Grid css={{ gap: '$6' }}>
        <WaitlistButtonWithLoading
          publicAddress={currentUserPublicAddress}
          token={authToken}
          user={user}
          isMyProfile={isMyProfile}
        />
        {!isLoadingUsedVotes && isCurrentUserVerified && (
          <Text
            css={{ fontFamily: '$body', fontWeight: 600, letterSpacing: -0.2 }}
          >
            Votes available {remainingVotesCount}/{TOTAL_VOTES}
          </Text>
        )}
      </Grid>
    </Box>
  );
}

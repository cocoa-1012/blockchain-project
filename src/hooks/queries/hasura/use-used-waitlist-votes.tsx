import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { ClientError } from 'graphql-request';

import { getWaitlistUsedVotes } from 'queries/hasura/waitlist';
import WaitlistVote from 'types/WaitlistVote';

interface WaitlistVotes {
  waitlistVotes: WaitlistVote[];
}

interface WaitlistVotesArgs
  extends UseQueryOptions<WaitlistVotes, ClientError, WaitlistVotes> {
  publicKey: string;
}

export default function useUsedWaitlistVotes({
  publicKey,
}: WaitlistVotesArgs): UseQueryResult<WaitlistVotes, ClientError> {
  return useQuery(
    ['usedVotes', publicKey],
    () => getWaitlistUsedVotes(publicKey),
    {
      enabled: Boolean(publicKey),
      refetchOnWindowFocus: false,
    }
  );
}

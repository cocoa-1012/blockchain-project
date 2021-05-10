import { useQuery, QueryResult, QueryFunctionOptions } from '@apollo/client';
import { GET_HASURA_USER_INVITE_COUNT } from 'queries/hasura/invites';

import AggregateCount from 'types/Aggregate';

import { maybeGetAddress } from 'utils/users';
interface InviteCodeData {
  inviteCount: AggregateCount;
  inviteRemainingCount: AggregateCount;
}

interface InviteCodeArgs extends QueryFunctionOptions {
  publicKey: string;
}

export default function useInviteCount({
  publicKey,
}: InviteCodeArgs): QueryResult<InviteCodeData> {
  return useQuery<InviteCodeData, InviteCodeArgs>(
    GET_HASURA_USER_INVITE_COUNT,
    {
      skip: !publicKey,
      context: { endpoint: 'hasura' },
      variables: { publicKey: maybeGetAddress(publicKey) },
    }
  );
}

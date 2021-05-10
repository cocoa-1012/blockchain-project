import { useQuery, QueryResult, QueryFunctionOptions } from '@apollo/client';

import { GET_INVITE_CODE } from 'queries/server/inviteCode';
import InviteCode from 'types/InviteCode';

interface InviteCodeData {
  inviteCode: InviteCode;
}

interface InviteCodeArgs {
  inviteCode: string;
}

interface UseInviteCodeArgs extends QueryFunctionOptions {
  inviteCode: string;
  token: string;
}

export default function useInviteCode({
  inviteCode,
  token,
  pollInterval,
}: UseInviteCodeArgs): QueryResult<InviteCodeData> {
  return useQuery<InviteCodeData, InviteCodeArgs>(GET_INVITE_CODE, {
    variables: { inviteCode: inviteCode },
    skip: !inviteCode || !token,
    context: { endpoint: 'server', token },
    pollInterval,
  });
}

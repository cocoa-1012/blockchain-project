import { useQuery, QueryResult, QueryHookOptions } from '@apollo/client';

import { GET_INVITE_CODES } from 'queries/server/inviteCode';
import InviteCode from 'types/InviteCode';

interface InviteCodeData {
  myInviteCodes: InviteCode[];
}

interface InviteCodeArgs extends QueryHookOptions {
  token: string;
}

export default function useInviteCodes({
  token,
  pollInterval,
}: InviteCodeArgs): QueryResult<InviteCodeData> {
  return useQuery<InviteCodeData>(GET_INVITE_CODES, {
    skip: !token,
    context: { endpoint: 'server', token },
    pollInterval,
  });
}
